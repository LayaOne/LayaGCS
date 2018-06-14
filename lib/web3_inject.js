/*
    web3 instance 注入器
*/
require('web3/dist/web3.min.js')
const LayaProvider = require('./laya_web3_provider');
const log = require('loglevel')


var web3Injector = {};


web3Injector.inject = function(){
    // setup background connection


    // compose the inpage provider
    var inpageProvider = new LayaProvider()

        
    // setup web3
    //
    var web3 = new Web3(inpageProvider)

    web3.setProvider = function () {
       console.log('LayaGCS重写了setProvider函数')
    }

    return web3;

}

module.exports = web3Injector;