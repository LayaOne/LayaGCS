var GCSHelper = {};



GCSHelper.get_current_network = function(){
    return GCSHelper.current_network;
}

GCSHelper.get_current_network_str = function(){

    if(GCSHelper.current_network == 0){
        return 'Ropsten Test Net'
    }
    
    return 'Main Net'
    
}

GCSHelper.get_random = function(min,max){
    return Math.floor(Math.random() * (max - min) + min);
}

GCSHelper.set_current_network = function(network){
    GCSHelper.current_network = network;
}

GCSHelper.set_game_stage = function(stage_node){
    GCSHelper.stage_node = stage_node;
}

GCSHelper.get_game_stage = function(){
    return GCSHelper.stage_node;
}

GCSHelper.center_sprite = function(sprite){
    sprite.pos(Laya.stage.width/ 2 - (sprite.width*0.5), Laya.stage.height  / 2 - (sprite.height*0.5));
}


GCSHelper.setWeb3Instance = function(web3Ins){
    GCSHelper.web3Ins = web3Ins;
}

GCSHelper.getWeb3Instance = function(){
    return GCSHelper.web3Ins;
}



GCSHelper.get_stage_width = function(){
    return Laya.stage.width;
}

GCSHelper.get_stage_height = function(){
    return Laya.stage.height;
}

/*
    生成基础界面元素
    网络、版本、浮层遮罩
*/
GCSHelper.generate_base_element = function(root_node){
     var Text = Laya.Text;
     var game_stage = GCSHelper.get_game_stage(); 

     //黑色透明遮罩
     var black_bg = new laya.display.Sprite();
     root_node.addChild(black_bg);
     var game_width = game_stage.width;
     var game_height = game_stage.height;
     black_bg.graphics.drawRect(0,0,game_width,game_height,'#2F2B2B');
     black_bg.alpha = 0.888;


     //当前网络
     var current_network = GCSHelper.get_current_network_str();
     var networkLabel = new Text();
     networkLabel.color = '#ffffff';
     networkLabel.fontSize = 25;
     networkLabel.pos(20,20);
     networkLabel.text = '当前网络: ' + current_network;
     root_node.addChild(networkLabel);


     //版本号
     var version_str = require('../package.json').version;
     var version_label = new Text();
     version_label.color = '#ffffff'
     version_label.fontSize = 25;
     version_label.text = 'LayaGCS v'  + version_str;
     version_label.x = 20;
     version_label.y = game_height - 30;
     root_node.addChild(version_label);


}

GCSHelper.get_a_close_button = function(root_node){

    var Resource = require('./gsc_assets').res;
    var game_stage = GCSHelper.get_game_stage(); 

    var game_width = game_stage.width;
    var game_height = game_stage.height;

    var close_button = new laya.display.Sprite();
    close_button.loadImage(Resource.close_button);
    close_button.scaleX = 0.2;
    close_button.scaleY = 0.2;
    close_button.x = game_width *  0.95;
    close_button.y = 20;
    root_node.addChild(close_button);

    return close_button;

}

GCSHelper.set_default_account = function(account){
    GCSHelper.default_account = account;
    GCSHelper.web3Ins.eth.defaultAccount = account;

}

GCSHelper.reload_account = function(){
    if(localStorage != undefined){
        GCSHelper.default_account = localStorage.getItem('laya_default_account');
        GCSHelper.default_WIF = localStorage.getItem('laya_default_wif');
        GCSHelper.web3Ins.eth.defaultAccount = GCSHelper.default_account;
    }
    else{
        console.warn('Not Found LocalStrogae')
    }
    
}

GCSHelper.save_account_info = function(obj){
    GCSHelper.default_account = obj.addr;
    GCSHelper.default_WIF = obj.wif;
    GCSHelper.web3Ins.eth.defaultAccount = GCSHelper.default_account;

    //todo 存入本地存储

    if(localStorage != undefined){
        localStorage.setItem('laya_default_account',GCSHelper.default_account);
        localStorage.setItem('laya_default_wif',GCSHelper.default_WIF);
    }
}

GCSHelper.get_default_wif = function(){
    return GCSHelper.default_WIF;
}


GCSHelper.get_default_account = function(){
    return GCSHelper.default_account;
}

module.exports = GCSHelper;