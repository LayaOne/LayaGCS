var LocalStorageStore = require('obs-store');
var GCSHelper = require('./gcs_helper');
var TxPage = require('./pages/tx_page');
var HookManager = {};

HookManager.hooking = false;


HookManager.initlize = function(){
    HookManager.store = new LocalStorageStore({storeage_key:'HookManager'});
    HookManager.store.subscribe(HookManager.on_push);
}

HookManager.on_push = function(single_tx){

    //console.log('弹出用户决定浮层');
    HookManager.hooking = true;
    TxPage.show_page(single_tx);

}

HookManager.on_opreate = function(){
    HookManager.hooking = false;
    TxPage.hide_self();
}

HookManager.push_once = function(id,params,callback){
    var single_tx = {};
    single_tx.id = id;
    single_tx.params = params;
    single_tx.callback = callback;

    console.log('hook push_once',single_tx);
    if(HookManager.hooking == false){
        HookManager.store.putState(single_tx);
    }
    else{
        callback('用户尚未决定上比交易',null);
    }
    
}

module.exports = HookManager;