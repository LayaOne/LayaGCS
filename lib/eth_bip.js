
var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')
var GCSHelper = require('./gcs_helper');


var ETHBip = {};

ETHBip.random_mnemonic = function(){
    var mnemonic = bip39.generateMnemonic();
    return mnemonic
}


ETHBip.gen_account = function(mnemonic){

    var Debug = GrowSetting.DEBUG;
    var mnemonic,base_path;
    
    var seed = bip39.mnemonicToSeed(mnemonic)

    var hdWallet = hdkey.fromMasterSeed(seed)

    var account_number = GCSHelper.get_random(10000,99999);

    var key1 = hdWallet.derivePath("m/44'/60'/0'/0/" + account_number);

    //public key
    var address1 = util.pubToAddress(key1._hdkey._publicKey, true)
    address1 = util.toChecksumAddress(address1.toString('hex'))

    //privatekey
    // var private_key = util.bufferToHex(key1._hdkey._privateKey);
    // private_key = (private_key.toString('hex'));

    

    console.log(address1);

    return address1;
}



module.exports = ETHBip;