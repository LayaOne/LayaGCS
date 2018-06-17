var webInject = require('./lib/web3_inject');


var web3 = webInject.inject();

// web3.version.getNetwork(function(err,res){
//     console.log(err,res);
// });


web3.eth.getBlockNumber(function(err,res){
    console.log(err,res);
})