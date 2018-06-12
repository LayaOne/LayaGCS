var LayaGCS = {};
var ShortCuts = require('./pages/short_cuts');
var GCSHelper = require('./gcs_helper');
var GCSAssets = require('./gsc_assets');
var MainPage  = require('./pages/main_page');

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
    Laya.loader.load(GCSAssets.sdk_assets,Laya.Handler.create(LayaGCS, LayaGCS.onSDKResouceLoaded ) , null);
    LayaGCS.initlized = true;

    
}


LayaGCS.onSDKResouceLoaded = function(){
    console.log('All SDK Resource Loaded');
}



/*
    显示登录浮层
*/
LayaGCS.show_login_ui = function(){
    if(!LayaGCS.initlized){
        console.warn('LayaGCS not initlized');
        return;
    }
    
    MainPage.show_self();
  
}

/*
    生成一个新的 ETH 账户，并返回公私钥
*/
LayaGCS.new_eth_account = function(){
    if(!LayaGCS.initlized){
        console.warn('LayaGSC not initlized');
        return;
    }
} 


/*
    取得当前登录账户
*/
LayaGCS.get_current_account = function(){

}

module.exports = LayaGCS;