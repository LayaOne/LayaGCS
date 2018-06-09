var LayaGCS = {};
var LoginPage = require('./pages/login_page');
var ShortCuts = require('./pages/short_cuts');

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

    ShortCuts.initlize(opt.laya_stage_node);


    LayaGCS.target_stage = opt.laya_stage_node;
    LayaGCS.initlized = true;
}



/*
    显示登录浮层
*/
LayaGCS.show_login_ui = function(){
    if(!LayaGCS.initlized){
        console.warn('LayaGCS not initlized');
        return;
    }
    
    //在Laya目标游戏中唤醒界面
    var login_page_node = LoginPage.get_page(LayaGCS.target_stage);
    LayaGCS.target_stage.addChild(login_page_node);

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


module.exports = LayaGCS;