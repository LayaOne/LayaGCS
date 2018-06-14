const pump = require('pump')
const RpcEngine = require('json-rpc-engine')
const createErrorMiddleware = require('./createErrorMiddleware')
const createIdRemapMiddleware = require('json-rpc-engine/src/idRemapMiddleware')
const createStreamMiddleware = require('json-rpc-middleware-stream')
const LocalStorageStore = require('obs-store')
const asStream = require('obs-store/lib/asStream')
const ObjectMultiplex = require('obj-multiplex')

module.exports = LayaWeb3Provider

function LayaWeb3Provider () {
  const self = this

  // setup connectionStream multiplexing
  const mux = self.mux = new ObjectMultiplex()
 

  // subscribe to metamask public config (one-way)
  self.publicConfigStore = new LocalStorageStore({ storageKey: 'LayaGCS-Config' })

  pump(
    mux.createStream('publicConfig'),
    asStream(self.publicConfigStore),
    (err) => logStreamDisconnectWarning('LayaGCS PublicConfigStore', err)
  )

  // ignore phishing warning message (handled elsewhere)
  mux.ignoreStream('phishing')

  // connect to async provider
  const streamMiddleware = createStreamMiddleware()
  pump(
    streamMiddleware.stream,
    mux.createStream('provider'),
    streamMiddleware.stream,
    (err) => logStreamDisconnectWarning('LayaGCS RpcProvider', err)
  )

  // handle sendAsync requests via dapp-side rpc engine
  const rpcEngine = new RpcEngine()
  rpcEngine.push(createIdRemapMiddleware())
  rpcEngine.push(createErrorMiddleware())
  rpcEngine.push(streamMiddleware)
  self.rpcEngine = rpcEngine
}

// handle sendAsync requests via asyncProvider
// also remap ids inbound and outbound
LayaWeb3Provider.prototype.sendAsync = function (payload, cb) {
  const self = this
  self.rpcEngine.handle(payload, cb)
}


LayaWeb3Provider.prototype.send = function (payload) {
  const self = this

  let selectedAddress
  let result = null
  switch (payload.method) {

    case 'eth_accounts':
      // read from localStorage
      selectedAddress = self.publicConfigStore.getState().selectedAddress
      result = selectedAddress ? [selectedAddress] : []
      break

    case 'eth_coinbase':
      // read from localStorage
      selectedAddress = self.publicConfigStore.getState().selectedAddress
      result = selectedAddress || null
      break

    case 'eth_uninstallFilter':
      self.sendAsync(payload, noop)
      result = true
      break

    case 'net_version':
      const networkVersion = self.publicConfigStore.getState().networkVersion
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

LayaWeb3Provider.prototype.isLayaGCS = true

// util

function logStreamDisconnectWarning (remoteLabel, err) {
  let warningMsg = `LayaGCS Web3 - lost connection to ${remoteLabel}`
  if (err) warningMsg += '\n' + err.stack
  console.warn(warningMsg)
}

function noop () {}