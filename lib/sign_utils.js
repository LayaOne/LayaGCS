"use strict";


const crypto = require('crypto');
const createKeccakHash = require('keccak');
const secp256k1 = require('secp256k1');
const assert = require('assert');
const BN = require('bn.js');
const uuid = require("uuid");


module.exports = {

    BN: BN,

    zeroBuffer: function (size) {
        return Buffer.allocUnsafe(size).fill(0);
    },


    /**
     * Attempts to turn a value into a `Buffer`.
     * As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
     * @param {Buffer|String|Number|BN|Object} v the value
     */
    toBuffer: function (v) {
        if (!Buffer.isBuffer(v)) {
            if (Array.isArray(v)) {
                v = Buffer.from(v);
            } else if (typeof v === 'string') {
                if (this.isHexString(v)) {
                    v = this.hexToBuffer(v);
                } else {
                    v = Buffer.from(v);
                }
            } else if (typeof v === 'number') {
                v = new BN(v);
                v = v.toArrayLike(Buffer);
            } else if (v === null || v === undefined) {
                v = Buffer.allocUnsafe(0)
            } else if (BN.isBN(v)) {
                v = v.toArrayLike(Buffer);
            } else if (v.toArray) {
                // converts a BN to a Buffer
                v = Buffer.from(v.toArray());
            } else {
                throw new Error('invalid type');
            }
        }
        return v;
    },


    /**
     * pad zero to the left of msg if its length is less than the maxLength.
     * if the length of msg exceeds the maxLength, then the msg is truncated.
     * @param {Buffer|Array}msg
     * @param maxLength
     * @returns {*}
     */
    padLeft: function (msg, maxLength) {
        const buf = this.zeroBuffer(maxLength);
        msg = this.toBuffer(msg);

        if (msg.length < maxLength) {
            msg.copy(buf, maxLength - msg.length);
            return buf;
        }
        return msg.slice(-maxLength);
    },


    /**
     *
     * @param {Buffer|Array}msg
     * @param maxLength
     * @returns {*}
     */
    padRight: function (msg, maxLength) {
        const buf = this.zeroBuffer(maxLength);
        msg = this.toBuffer(msg);
        if (msg.length < maxLength) {
            msg.copy(buf);
            return buf;
        }
        return msg.slice(0, maxLength);
    },


    unpadLeft: function (msg) {
        msg = this.strip0x(msg);
        let first = msg[0];
        while (msg.length > 0 && first.toString() === '0') {
            msg = msg.slice(1);
            first = msg[0];
        }
        return msg;
    },


    /**
     *
     * @param {Buffer|Array|String} hex
     * @returns {boolean}
     */
    is0xPrefixed: function (hex) {
        if (!hex) return false;
        return hex[0].toString() === '0' && hex[1].toString() === 'x';
    },


    /**
     *
     * @param {Buffer|Array|String}hex
     * @returns {*}
     */
    strip0x: function (hex) {
        if (this.is0xPrefixed(hex)) {
            return hex.slice(2);
        }
        return hex;
    },


    /**
     * Adds "0x" to a given `String` if it does not already start with "0x"
     * @param {String} hex
     * @return {String}
     */
    add0x: function (hex) {
        if (typeof hex !== 'string') {
            return hex;
        }
        return this.is0xPrefixed(hex) ? hex : '0x' + hex;
    },


    /**
     * Check whether a string is valid hex, must has leading '0x'
     *
     * @param {String} s String to validate.
     * @return {boolean} True if the string is valid hex, false otherwise.
     */
    isHexString: function (s) {
        if (s.length % 2 === 0 && s.match(/^0x[0-9a-f]+$/i)) return true;
        return false;
    },


    /**
     * Check whether a string is valid base-64.
     * @param {string} s String to validate.
     * @return {boolean} True if the string is valid base-64, false otherwise.
     */
    isBase64String: function (s) {
        let index;
        if (s.length % 4 > 0 || s.match(/[^0-9a-z+\/=]/i)) return false;
        index = s.indexOf("=");
        if (index === -1 || s.slice(index).match(/={1,2}/)) return true;
        return false;
    },


    /**
     * Converts a `Buffer` to a `Number`
     * @param {Buffer} buf
     * @return {Number}
     * @throws If the input number exceeds 53 bits.
     */
    bufferToInt: function (buf) {
        return new BN(this.toBuffer(buf)).toNumber();
    },


    /**
     * convert buffer into a hex string. No leading '0x' prepended.
     * @param {Buffer} buf
     * @return {String}
     */
    bufferToHex: function (buf) {
        return buf.toString('hex');
    },


    /**
     * convert buffer into a hex string with '0x' prefix
     * @param {Buffer}buf
     * @returns {String}
     */
    bufferToHexWith0x: function (buf) {
        buf = this.toBuffer(buf);
        let hex = buf.toString('hex');
        return this.add0x(hex);
    },

	
	/** convert string into a hex string with '0x' prefix
	 * @param {String} str
	 * @returns {String}
	 */
	stringToHexWith0x : function(str){
		return '0x' + Buffer.from(str).toString('hex');
	},


    /**
     * parse hex string data to buffer.
     * @param {String}hex  hex string with or without '0x' prefix
     * @return {Buffer}
     */
    hexToBuffer: function (hex) {
        hex = this.strip0x(hex);
        return Buffer.from(hex, 'hex');
    },


    /**
     * Returns a zero address
     * @method zeroAddress
     * @return {String}
     */
    zeroAddress: function () {
        const zeroAddress = this.zeroBuffer(20);
        return this.bufferToHexWith0x(zeroAddress);
    },


    /**
     * Checks if a given address is a zero address
     * @method isZeroAddress
     * @param {String} address
     * @return {Boolean}
     */
    isZeroAddress: function (address) {
        const zeroAddress = this.zeroAddress();
        return zeroAddress === address;
    },


    /**
     * Checks if the address is a valid. Accepts checksummed addresses too
     * @param {String} address
     * @return {Boolean}
     */
    isValidAddress: function (address) {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    },


    /**
     * Returns a checksummed address
     * @param {String} address
     * @return {String}
     */
    checksumAddress: function (address) {
        address = this.strip0x(address).toLowerCase();
        const hash = this.bufferToHex(this.keccak(address));

        let ret = '0x';
        for (let i = 0; i < address.length; i++) {
            if (parseInt(hash[i], 16) >= 8) {
                ret += address[i].toUpperCase();
            } else {
                ret += address[i];
            }
        }

        return ret;
    },

    /**
     * Checks if the address is a valid checksummed address
     * @param {String} address
     * @return {Boolean}
     */
    isValidChecksumAddress: function (address) {
        return this.isValidAddress(address) &&
            (this.checksumAddress(address) === address);
    },


    /**
     *  generate random data of length specified by size
     * @param {Number} size
     * @return {Buffer} random data
     */
    crytoRandom: function (size) {
        return crypto.randomBytes(size);
    },


    /**
     * generate random 128-bit UUID
     * @returns {*}
     */
    newUUID: function () {
        return uuid.v4();
    },


    /**
     * Creates Keccak hash of the input
     * @param {Buffer|Array|String|Number} msg the input data
     * @param {Number} [bits=256] the Keccak width
     * @return {Buffer}
     */
    keccak: function (msg, bits) {
        if (!bits) bits = 256;
        return createKeccakHash('keccak' + bits).update(this.toBuffer(msg)).digest();
    },


    /**
     * Creates Keccak-256 hash of the input, alias for keccak(a, 256)
     * @param {Buffer|Array|String|Number} msg the input data
     * @return {Buffer}
     */
    keccak256: function (msg) {
        return this.keccak(msg, 256);
    },


    /**
     * Creates SHA-3 (Keccak) hash of the input
     * @param {Buffer|Array|String|Number} a the input data
     * @return {Buffer}
     */
    sha3: function (msg) {
        return this.keccak256(msg);
    },


    /**
     * Creates SHA256 hash of the input
     * @param {Buffer|Array|String|Number} msg the input data
     * @return {Buffer}
     */
    sha256: function (msg) {
        return crypto.createHash('sha256').update(this.toBuffer(msg)).digest();
    },


    /**
     * Checks if the private key satisfies the rules of the curve secp256k1.
     * @param {Buffer} privateKey
     * @return {Boolean}
     */
    isValidPrivateKey: function (privateKey) {
        return secp256k1.privateKeyVerify(privateKey);
    },


    /**
     * Checks if the public key satisfies the rules of the curve secp256k1
     * layacloud uses the uncompressed form and remove the leading flag byte.
     * @param {Buffer} publicKey The two points of an uncompressed key
     * @return {Boolean}
     */
    isValidPublicKey: function (publicKey) {
        if (publicKey.length === 64) {   //uncompressed
            // Convert to SEC1 for secp256k1
            return secp256k1.publicKeyVerify(Buffer.concat([Buffer.from([4]), publicKey]));
        }

        return secp256k1.publicKeyVerify(publicKey);
    },


    /**
     *
     * @returns {Buffer} 32 bytes wide private key
     */
    genPrivateKey: function () {
        let priv;
        do {
            priv = this.crytoRandom(32);
        }
        while (!this.isValidPrivateKey(priv));
        return priv;
    },


    /**
     * Returns the public key of a given private key
     *
     * @param {Buffer} privateKey A private key must be 32 bytes wide
     * @return {Buffer}
     */
    privateToPublicKey: function (privateKey) {
        return secp256k1.publicKeyCreate(privateKey, false).slice(1);
    },


    /**
     * Returns the address of a given public key.
     * @param {Buffer} pubKey The two points of an uncompressed key
     * @return {String}
     */
    publicToAddress: function (pubKey) {
        assert(this.isValidPublicKey(pubKey), "invalid pubkey");

        if ((pubKey.length !== 64)) {
            pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1);
        }
        assert(pubKey.length === 64);
        return this.checksumAddress(this.bufferToHex(this.keccak(pubKey).slice(-20)));
    },


    /**
     * Returns the address of a given private key
     * @param {Buffer} privateKey A private key must be 32 bytes wide
     * @return {String}
     */
    privateToAddress: function (privateKey) {
        return this.publicToAddress(this.privateToPublicKey(privateKey));
    },


    /**
     * ECDSA sign.
     * @param {Buffer|String} msg
     * @param {Buffer} privateKey
     * @return {Object}
     */
    sign: function (msg, privateKey) {
        msg = this.toBuffer(msg);

        let msgHash = this.keccak256(msg);

        const sig = secp256k1.sign(msgHash, privateKey);

        let ret = {};
        ret.r = sig.signature.slice(0, 32);
        ret.s = sig.signature.slice(32, 64);
        ret.v = sig.recovery + 27;
        return ret;
    },


    /**
     * verify signature using public key
     * @param {Buffer|String}msg
     * @param {Buffer} r
     * @param {Buffer} s
     * @param {Buffer}pubkey
     * @returns {*}
     */
    verify: function (msg, r, s, pubkey) {

        assert(pubkey.length === 64 || pubkey.length === 33, "invalid pubkey length");
        const signature = Buffer.concat([this.padLeft(r, 32), this.padLeft(s, 32)], 64);

        msg = this.toBuffer(msg);
        let msgHash = this.keccak256(msg);

        if (pubkey.length === 64) {
            pubkey = Buffer.concat([Buffer.from([4]), pubkey]);
        }
        return secp256k1.verify(msgHash, signature, pubkey);
    },


    /**
     * ECDSA public key recovery from signature. align with ETH
     * @param {Buffer|String} msg
     * @param {Number} v
     * @param {Buffer} r
     * @param {Buffer} s
     * @return {Buffer} publicKey
     */
    recover: function (msg, r, s, v) {
        const signature = Buffer.concat([this.padLeft(r, 32), this.padLeft(s, 32)], 64);
        const recovery = v - 27;
        assert(recovery == 0 || recovery == 1, "invalid signature v");

        msg = this.toBuffer(msg);
        let msgHash = this.keccak256(msg);

        const pubkey = secp256k1.recover(msgHash, signature, recovery);
        return secp256k1.publicKeyConvert(pubkey, false).slice(1);
    },


    /**
     * convert to string representation of signature in hex format, 65 bytes.
     * @param {Number} v
     * @param {Buffer} r
     * @param {Buffer} s
     * @return {String} sig
     */
    toSignatureString: function (r, s, v) {
        assert(v == 27 || v == 28, "invalid signature recovery value");

        return this.bufferToHexWith0x(Buffer.concat([
            this.padLeft(r, 32),
            this.padLeft(s, 32),
            this.toBuffer(v)
        ]));

    },


    /**
     *
     * @param {String} stringSig
     * @returns {{v: *, r: Buffer, s: Buffer}}
     */
    toSignatureRSV: function (stringSig) {
        let sig = this.toBuffer(stringSig);
        assert(sig.length == 65, "Invalid signature length");

        return {
            r: sig.slice(0, 32),
            s: sig.slice(32, 64),
            v: sig[64] < 27 ? sig[64] + 27 : sig[64]
        }
    },


    /**
     * Validate ECDSA signature
     * @method isValidSignature
     * @param {Buffer} v
     * @param {Buffer} r
     * @param {Buffer} s
     * @return {Boolean}
     */
    isValidSignature: function (r, s, v) {
        //const SECP256K1_N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);
        const SECP256K1_N = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16);

        if (r.length !== 32 || s.length !== 32) {
            return false;
        }

        if (v !== 27 && v !== 28) {
            return false;
        }

        r = new BN(r);
        s = new BN(s);

        if (r.isZero() || r.gt(SECP256K1_N) || s.isZero() || s.gt(SECP256K1_N)) {
            return false;
        }
        return true;
    },


    /**
     * Calculate MAC(message authentication code). The MAC is the keccak-256 hash
     * of the byte array formed by concatenating the second 16 bytes of the key with
     * the msg contents.
     * @param {Buffer|string} key
     * @param {Buffer|string} msg
     * @return {string} Hex-encoded MAC.
     */
    hmac: function (key, msg) {
        assert(key !== undefined && key !== null && msg !== undefined && msg != null, "empty key or msg");
        key = this.toBuffer(key);

        return this.bufferToHex(this.keccak256(
            Buffer.concat([key, this.toBuffer(msg)])
        ));
    },


    /**
     * Check if the selected cipher is available.
     * @param {String} cipher Encryption algorithm.
     * @return {boolean} If available true, otherwise false.
     */
    isCipherAvailable: function (cipher) {
        return crypto.getCiphers().some(function (name) {
            return name === cipher;
        });
    },


    /**
     * Symmetric private key encryption using secret (derived) key.
     * @param {Buffer|string} plaintext Data to be encrypted.
     * @param {Buffer|string} key Secret key.
     * @param {Buffer|string} iv Initialization vector.
     * @param {String=} algo Encryption algorithm
     * @return {Buffer} Encrypted data.
     */
    aesEncrypt: function (plaintext, key, iv, algo) {
        assert(this.isCipherAvailable(algo), algo + " is not available");

        let cipher = crypto.createCipheriv(algo, this.toBuffer(key), this.toBuffer(iv));
        let ciphertext = cipher.update(this.toBuffer(plaintext));
        return Buffer.concat([ciphertext, cipher.final()]);
    },


    /**
     * Symmetric private key decryption using secret (derived) key.
     * @param {Buffer|string} ciphertext Data to be decrypted.
     * @param {Buffer|string} key Secret key.
     * @param {Buffer|string} iv Initialization vector.
     * @param {string=} algo Encryption algorithm
     * @return {Buffer} Decrypted data.
     */
    aesDecrypt: function (ciphertext, key, iv, algo) {
        assert(this.isCipherAvailable(algo), algo + " is not available");

        let decipher = crypto.createDecipheriv(algo, this.toBuffer(key), this.toBuffer(iv));
        let plaintext = decipher.update(this.toBuffer(ciphertext));
        return Buffer.concat([plaintext, decipher.final()]);
    },


    /**
     *   sign message
     * @param {String} message
     * @param {String|Buffer} privateKey. string in hex encoding
     * @return String signature
     */
    signMessage: function (message, privateKey) {
        assert(message && privateKey, "invalid param");

        let key = privateKey;
        if (typeof(privateKey) === 'string') {
            key = this.hexToBuffer(privateKey);
        }

        let signature = this.sign(message, key);
        return this.toSignatureString(signature.r, signature.s, signature.v);
    },


    /**
     * verify signature using sender's address
     * @param {string} msg
     * @param {string} sig  string representation
     * @param {string} address
     */
    verifySignatureUsingAddress: function (msg, sig, address) {
        assert(msg && sig && address, "invalid param");

        sig = this.toSignatureRSV(sig);

        let pubkey = this.recover(msg, sig.r, sig.s, sig.v);
        return this.checksumAddress(address) === this.publicToAddress(pubkey);
    },

};


