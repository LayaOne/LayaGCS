var LayaGCS = {};
var ShortCuts = require('./pages/short_cuts');
var GCSHelper = require('./gcs_helper');
var MainPage  = require('./pages/main_page');
var ETHBip =  require('./eth_bip');
var Web3 = require('web3');
var LayaProvider = require('./laya_web3_provider');
var HookManager  = require('./hook_manager');
var ethSign = require('./eth_sign');

LayaGCS.initlized = false;

/*
    初始化
    检测环境，是否有LayaAir
    参数:
    {
        laya_stage_node, //舞台节点，用于渲染SDK界面的根节点
    }
*/

LayaGCS.initlize = function(opt){
    if(!opt){
        console.warn('init参数不正确')
        return ;
    }

    if(!opt.laya_stage_node){
        console.warn('没有传入根节点');
        return;
    }

    

    if(!Laya && !laya){
        console.warn('没检测到Laya环境');
        return;
    }

    //0 rinkby
    //1 mainnet
    if(!opt.network){
        LayaGCS.network = 0;
    }
    else{
        LayaGCS.network = opt.network;
    }

    GCSHelper.set_current_network(LayaGCS.network);
    ShortCuts.initlize(opt.laya_stage_node);


    LayaGCS.target_stage = opt.laya_stage_node;
    GCSHelper.set_game_stage(LayaGCS.target_stage);


    //读取资源
    var GCSAssets = require('./gsc_assets');
    Laya.loader.load(GCSAssets.sdk_assets,Laya.Handler.create(LayaGCS, LayaGCS.onSDKResouceLoaded ) , null);

    



    var layaProvider = new LayaProvider(LayaGCS.network);
    LayaGCS.web3 = new Web3(layaProvider);
    LayaGCS.web3.setProvider = function () {
        console.log('LayaGCS重写了setProvider函数')
        return;
    }

    GCSHelper.setWeb3Instance(LayaGCS.web3);


    if(opt.auto_load_last_account){
        console.log('LayaGCS : 读取上次账户')
        GCSHelper.reload_account();
    }
    else{
        console.log('LayaGCS : 使用新账户');
    }
    //GCSHelper.set_default_account('0x99A7fDF466B44301317453C4fBe213F5114519F5');
   


    HookManager.initlize();

    //注入变量
    ETHBip.initlize();
    LayaGCS.ETHBip = ETHBip;
    LayaGCS.ethSign = ethSign;

    
}

LayaGCS.set_inited_callback = function(cb,custom_data){

    console.log('设置初始化回调',cb,custom_data);
    LayaGCS.init_callback_custom_data = custom_data;
    LayaGCS.initlized_callback = cb;
}


LayaGCS.onSDKResouceLoaded = function(){
    console.log('All SDK Resource Loaded');
    LayaGCS.initlized = true;
    if(LayaGCS.initlized_callback != undefined){
        LayaGCS.initlized_callback(LayaGCS.init_callback_custom_data);
    }
    else{
        console.log('LayaGCS未设置初始化回调')
    }
}



/**
 * 适配LayaDCloud
 * @param {*} caller 
 * @param {*} callback 
 */
LayaGCS.dcloud_login = function(callback){
  
    MainPage.show_self(LayaGCS.target_stage,callback);
}


/*
    显示登录浮层
*/
LayaGCS.show_login_ui = function(laya_stage){
    if(!LayaGCS.initlized){
        console.warn('LayaGCS not initlized');
        return;
    }
    
    MainPage.show_self(laya_stage);
  
}




/*
    取得当前登录账户
*/
LayaGCS.get_current_account = function(){
    return GCSHelper.get_default_account();
}

LayaGCS.get_default_wif = function(){
    return GCSHelper.get_default_wif();
}


module.exports = LayaGCS;

if(window != undefined){
    console.log('LayaGCS变量注入');
    window.LayaGCS = LayaGCS;
}