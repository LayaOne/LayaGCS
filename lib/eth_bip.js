
var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')
var GCSHelper = require('./gcs_helper');
const Tx = require('ethereumjs-tx');
var co = require('co')
const web3admin = require('./web3Admin.js');

var ETHBip = {};

ETHBip.initlize = function(){
    web3admin.extend(GCSHelper.web3Ins);
}


ETHBip.random_mnemonic = function(){
    var mnemonic = bip39.generateMnemonic();
    return mnemonic
}


ETHBip.gen_account = function(mnemonic){


    
    var seed = bip39.mnemonicToSeed(mnemonic)

    var hdWallet = hdkey.fromMasterSeed(seed)

    var account_number = GCSHelper.get_random(10000,99999);

    var key1 = hdWallet.derivePath("m/44'/60'/0'/0/" + account_number);

    //public key
    var address1 = util.pubToAddress(key1._hdkey._publicKey, true)
    address1 = util.toChecksumAddress(address1.toString('hex'))

    //privatekey
     var private_key = util.bufferToHex(key1._hdkey._privateKey);
     private_key = (private_key.toString('hex'));


    return {addr:address1 , wif:private_key};
}



ETHBip._calcNonceInQueued = function(key, content, transCount){
    if (key in content) {
        // content中的交易，是因为nonce不连贯导致，所以要找出对应的nonce
        let nonceList = Object.keys(content).map(elem => parseInt(elem));
        let max = Math.max(...nonceList);
        let corruptList = [];
        for(let i = transCount; i <= max; ++i) {
          corruptList.push(i);
        }
        let nonceSet = new Set(nonceList);
        let diffSet = new Set(
          corruptList.filter(x => !nonceSet.has(x))
        )
        // 空隙的nonce
        let gapList = [...diffSet];
        if(gapList.length > 0) {
          return gapList[0];
        } 
      } 
      return null
}



ETHBip._calcNonceInPending = function(key, content){
    let kvList = Object.keys(content).map((elem) => {return {address: elem.toLowerCase(), data:content[elem]}})
    for(let i = 0; i < kvList.length; ++i) {
        if(kvList[i].address == key) {
        // 找到此地址
        let nonceList = Object.keys(kvList[i].data).map(elem => parseInt(elem))
        let max = Math.max(...nonceList);
        return max + 1
        }
    }
    return null;
}



ETHBip._getNonce = function(address,cb){

    co(function*(){

        var web3 = GCSHelper.web3Ins;

        let key = address.toLowerCase();
        // 已经完成的交易数目
        let transCount = yield function(done){
            web3.eth.getTransactionCount(address,done);
        }

        var qp_result = yield function(done){
            web3.txpool.content(done) ;
        }

        console.log('=== qp result',qp_result);

        var queued = qp_result.queued;
        var pending = qp_result.pending;


        // let queued = web3.txpool.content.queued;
        // let pending = web3.txpool.content.pending;

        // 从queued中计算合适的nonce
        let nonceQueued = ETHBip._calcNonceInQueued(key, queued, transCount);
        if(nonceQueued) {
            cb(null,nonceQueued)
        }
        // 从pending中计算noncde
        let noncePending = ETHBip._calcNonceInPending(key, pending);
        if(noncePending) {
            cb(null,noncePending)
        }

        cb(null,transCount)
    })
   
}



ETHBip._genSignedTx = function(tx,privateKey){
    
    var GAS_LIMIT = 800000;
    var GAS_PRICE = 20;
    if(tx.gas == undefined){
        tx.gas = GAS_LIMIT;
    }
    if(tx.gasPrice == undefined){
        tx.gasPrice = GAS_PRICE
    }
    
    if(tx.value == undefined){
        tx.value = 0;
    }


    var rawTx = {
        from: tx.from,
        to: tx.to,
        value: web3.toHex(tx.value),
        data: tx.data,
        gasLimit: web3.toHex(tx.gas),
        gasPrice: web3.toHex(tx.gasPrice),
        nonce: web3.toHex(tx.nonce),
        chainId: tx.chainId
    };


    var txSigned = new Tx(rawTx);
    txSigned.sign(privateKey);
    var serializedTx = "0x" + txSigned.serialize().toString('hex');
    return [rawTx, serializedTx];
}


ETHBip.signAndSendTx = function(txInfo,cb){

    co(function*(){

        try{
            var web3 = GCSHelper.web3Ins;
            var withoutZeroX = GCSHelper.default_WIF.substring(2,GCSHelper.default_WIF.length);
            var privateKey = Buffer.from(withoutZeroX, 'hex');
    
            var nonce =  yield function(done){
                ETHBip._getNonce(txInfo.from,done);
            } 
    
    
            var [rawTx, serializedTx] = ETHBip._genSignedTx(txInfo, privateKey);
    
            console.log("\ntx:", rawTx);
            console.log("txSigned:", serializedTx);
    
    
            var sendRawResult = yield function(done){
                web3.eth.sendRawTransaction(serializedTx,done);
            }
    
            console.log('send raw result',sendRawResult);
    
            cb(null,sendRawResult);
        }
        catch(e){
            cb(e,null);
        }
       
        
    })
  
}


module.exports = ETHBip;