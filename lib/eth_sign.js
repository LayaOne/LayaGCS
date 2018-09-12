const util = require('./sign_utils');


const PREFIX = "\x19Ethereum Signed Message:\n";

/**
 * verify ETH signature
 * @param {String}msg the original message signed
 * @param {String}sig signature
 * @param {String}ethAddr the ETH address
 */
module.exports.verifySignature = function (msg, sig, ethAddr) {
    msg = util.toBuffer(msg);
    let buf = Buffer.concat([util.toBuffer(PREFIX),
        util.toBuffer("" + msg.length),
        msg]);

    sig = util.toSignatureRSV(sig);
    let pubKey = util.recover(buf, sig.r, sig.s, sig.v);
    return util.checksumAddress(ethAddr) === util.publicToAddress(pubKey);
};


/**
 * sign message
 * @param {String}msg
 * @param {Buffer|String} privateKey  could be a hex string with the '0x' prefix
 * @return {String} signature
 */
module.exports.sign = function (msg, privateKey) {
    msg = util.toBuffer(msg);
    let buf = Buffer.concat([util.toBuffer(PREFIX),
        util.toBuffer("" + msg.length),
        msg]);

    privateKey = util.hexToBuffer(privateKey);
    let sig = util.sign(buf, privateKey);

    return util.toSignatureString(sig.r, sig.s, sig.v);
};
