/*
    web3 instance 注入器
*/
var Web3 = require('web3');
const LayaProvider = require('./lib/laya_web3_provider');
const log = require('loglevel')
var GCSHelper = require('./lib/gcs_helper');
var web3Injector = {};


web3Injector.inject = function(network){
    // setup background connection
  
    var inpageProvider = new LayaProvider(network)

    // setup web3
    //
    var web3 = new Web3(inpageProvider)

    web3.setProvider = function () {
       console.log('LayaGCS重写了setProvider函数')
    }

    return web3;

}

module.exports = web3Injector;