



var errors = require('./errors');
var GCSHelper = require('./gcs_helper');

// workaround to use httpprovider in different envs

// browser
if (typeof window !== 'undefined' && window.XMLHttpRequest) {
  XMLHttpRequest = window.XMLHttpRequest; // jshint ignore: line
// node
} else {
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest; // jshint ignore: line
}

var XHR2 = require('xhr2'); // jshint ignore: line

/**
 * LayaWeb3Provider should be used to send rpc calls over http
 */

var LayaWeb3Provider = function ( network , timeout, user, password, headers) {

  if(network == undefined){
      network = 0;
  }

  //rinkby
  if( network == 0){
      this.host = 'http://testrpc.laya.one'
  }
  else{
      this.host = 'http://rpc.laya.one'
  }

  this.timeout = timeout || 0;
  this.user = user;
  this.password = password;
  this.headers = headers;
};


LayaWeb3Provider.prototype.prepareRequest = function(async){
    var request;

    if (async) {
        request = new XHR2();
        request.timeout = this.timeout;
    } else {
        request = new XMLHttpRequest();
    }

    request.open('POST', this.host, async);
    if (this.user && this.password) {
        var auth = 'Basic ' + new Buffer(this.user + ':' + this.password).toString('base64');
        request.setRequestHeader('Authorization', auth);
    } request.setRequestHeader('Content-Type', 'application/json');
    if(this.headers) {
        this.headers.forEach(function(header) {
            request.setRequestHeader(header.name, header.value);
        });
    }
    return request;
}



LayaWeb3Provider.prototype.sendAsync = function (payload, cb) {

    console.log('Laya SendAsync',payload);

    var request = this.prepareRequest(true);

    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.timeout !== 1) {
        var result = request.responseText;
        console.log('=== result',result);
        var error = null;
  
        try {
          result = JSON.parse(result);
        } catch (e) {
          error = errors.InvalidResponse(request.responseText);
        }
  
        cb(error, result);
      }
    };
  
    request.ontimeout = function () {
        cb(errors.ConnectionTimeout(this.timeout));
    };
  
    try {
      request.send(JSON.stringify(payload));
    } catch (error) {
        cb(errors.InvalidConnection(this.host));
    }
}


LayaWeb3Provider.prototype.send = function (payload) {
  const self = this

  let selectedAddress
  let result = null
  switch (payload.method) { 

    case 'eth_accounts':
      // read from localStorage
      selectedAddress = GCSHelper.get_default_account();
      result = selectedAddress ? [selectedAddress] : []
      break

    case 'eth_coinbase':
      // read from localStorage
      selectedAddress = GCSHelper.get_default_account();
      result = selectedAddress ||null 
      break

    case 'eth_uninstallFilter':
      self.sendAsync(payload, noop)
      result = true
      break

    case 'net_version':
      const networkVersion = GCSHelper.get_current_network();
      result = networkVersion || null
      break

    // throw not-supported Error
    default:
      var link = 'https://laya.one'
      var message = `LayaGCS的web3实例不支持 ${payload.method} 方法不给Callback函数，该方法必须异步调用. 请去官网 ${link} 获取详情`
      throw new Error(message)

  }

  // return the result
  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    result: result,
  }
}

LayaWeb3Provider.prototype.isConnected = function () {
  return true
}

LayaWeb3Provider.prototype.isLayaGCS = true;

// util

function logStreamDisconnectWarning (remoteLabel, err) {
  let warningMsg = `LayaGCS Web3 - lost connection to ${remoteLabel}`
  if (err) warningMsg += '\n' + err.stack
  console.warn(warningMsg)
}

function noop () {}


module.exports = LayaWeb3Provider