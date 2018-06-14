var webInject = require('./lib/web3_inject');


var web3 = webInject.inject();

web3.eth.getBlock();