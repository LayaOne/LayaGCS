var MainPage = {};
var GCSHelper = require('../gcs_helper');
var Resource = require('../gsc_assets').res;
var ETHBip = require('../eth_bip');
const EthUtil = require('ethereumjs-util');

MainPage.root_node = undefined;
MainPage.show_self = function(game_stage,close_cb){

    if(close_cb != undefined){
        MainPage.close_cb = close_cb;
    }


    if(!MainPage.root_node){
        MainPage.stage_node = game_stage;
        //创建MainPage
        MainPage.root_node = new laya.display.Sprite();
        var root_node = MainPage.root_node;

        GCSHelper.generate_base_element(root_node);
        var single_close_button_sprite = GCSHelper.get_a_close_button(root_node);
       
        single_close_button_sprite.on('click',MainPage,MainPage.close_self);

        if(GCSHelper.get_default_account() == undefined){
            MainPage.create_option_page();
        }
        else{
            MainPage.show_account_page();
        }
        
        root_node.zOrder = 99999;
        game_stage.addChild(root_node);

        //game_stage.on('click',MainPage,MainPage.global_click);

    }
    else{
        MainPage.root_node.visible = true;
    }
}

MainPage.global_click = function(){
    console.log("mouse:", Laya.stage.mouseX, Laya.stage.mouseY);
}

/**
 * 
 * @param {*} width_height 宽高 0 | 1
 * @param {*} percent 数值
 */
MainPage.calc_percent = function(width_height , percent){
    var target_postion = 0;
    if(width_height == 0){
        target_postion = Laya.stage.width * ( percent * 0.01);
    }
    else{
        target_postion = Laya.stage.height * (percent * 0.01);
    }
    return target_postion;
}
/*
    导入地址界面
*/
MainPage.import_account_page = function(){
    MainPage.option_node.visible = false;
    var import_root_node = new laya.display.Sprite();
    MainPage.import_root_node = import_root_node;

    var Text = Laya.Text;
    var Input   = Laya.Input;
    var font_size = 30;
    var key_size = 16;

    var eth_label = new Text();
    eth_label.color = '#ffffff';
    eth_label.fontSize = font_size;
    eth_label.text = 'ETH地址'
    eth_label.x = MainPage.calc_percent(0,10);
    eth_label.y = MainPage.calc_percent(1,40);

    import_root_node.addChild(eth_label);

    var eth_input = new Input();
    MainPage.import_eth_input = eth_input;
    eth_input.size(MainPage.calc_percent(0,60),40);
    eth_input.x = eth_label.x + eth_label.width + 30;
    eth_input.y = MainPage.calc_percent(1,40);
    eth_input.bgColor = '#000000';
    eth_input.color = '#FFFFFF';
    eth_input.fontSize = key_size;
    import_root_node.addChild(eth_input);


    var private_key_label = new Text();
    private_key_label.color = '#fff';
    private_key_label.fontSize = font_size;
    private_key_label.text = '私钥'
    private_key_label.x = MainPage.calc_percent(0,10);
    private_key_label.y = MainPage.calc_percent(1,50);
    import_root_node.addChild(private_key_label);


    var private_key_input = new Input();
    MainPage.import_private_key_input = private_key_input;
    private_key_input.size(MainPage.calc_percent(0,60),40);
    private_key_input.x = eth_label.x + eth_label.width + 30;
    private_key_input.y = MainPage.calc_percent(1,50);
    private_key_input.fontSize = key_size;
    private_key_input.color = '#fff';
    private_key_input.bgColor = '#000'
    import_root_node.addChild(private_key_input);


    //导入按钮
    var import_button = new laya.display.Sprite();
    import_button.loadImage(Resource.import_button);
    GCSHelper.center_sprite(import_button);
    import_button.y = MainPage.calc_percent(1,60);
    import_root_node.addChild(import_button);
    import_button.on('click',MainPage,MainPage.import_account);


    var borad_label =  new Text();
    MainPage.status_text = borad_label;
    borad_label.color = '#fff';
    borad_label.fontSize = 30;
    borad_label.align = 'center';
    borad_label.text = '导入失败，请重试';
    borad_label.visible = false;
    GCSHelper.center_sprite(borad_label);
    borad_label.y = Laya.stage.height * 0.75; 
    import_root_node.addChild(borad_label);


    MainPage.root_node.addChild(import_root_node);


    
}

MainPage.import_account = function(){
    var import_eth_address = MainPage.import_eth_input.text;
    var import_eth_WIF = MainPage.import_private_key_input.text;

    //简单判断
    try{
        var publicKey = EthUtil.privateToPublic(new Buffer(import_eth_WIF, 'hex'));
        var addr ="0x"+ EthUtil.publicToAddress(publicKey).toString('hex');
        addr = addr.toLowerCase();
        var import_pub = import_eth_address.toLowerCase();
        if(addr != import_pub){
            MainPage.status_text.visible = true;
            MainPage.status_text.text = '导入失败，请重试'
        }
        else{
            var obj_info = {};
            obj_info.addr = import_eth_address;
            obj_info.wif = import_eth_WIF
            GCSHelper.save_account_info(obj_info);

            //跳转到首页
            MainPage.import_root_node.removeSelf();
            MainPage.show_account_page();
        }
    }
    catch(e){
        MainPage.status_text.visible = true;
        MainPage.status_text.text = '导入失败，请重试';
    }
    
    
}



/*
    分配新地址界面
*/

MainPage.create_newAccount_page = function(){


    var account_node = new laya.display.Sprite();
    MainPage.account_node = account_node;

    var Text = Laya.Text;
    var Input   = Laya.Input;

    var font_size = 30;
    var key_size = 16;

    var eth_label = new Text();
    eth_label.color = '#ffffff';
    eth_label.fontSize = font_size;
    eth_label.text = 'ETH地址'
    eth_label.x = MainPage.calc_percent(0,10);
    eth_label.y = MainPage.calc_percent(1,40);

    account_node.addChild(eth_label);

    var eth_input = new Input();
    MainPage.eth_input = eth_input;
    eth_input.size(MainPage.calc_percent(0,60),40);
    eth_input.x = eth_label.x + eth_label.width + 30;
    eth_input.y = MainPage.calc_percent(1,40);
    eth_input.bgColor = '#000000';
    eth_input.color = '#FFFFFF';
    eth_input.fontSize = key_size;
    account_node.addChild(eth_input);


    var private_key_label = new Text();
    private_key_label.color = '#fff';
    private_key_label.fontSize = font_size;
    private_key_label.text = '私钥'
    private_key_label.x = MainPage.calc_percent(0,10);
    private_key_label.y = MainPage.calc_percent(1,50);
    account_node.addChild(private_key_label);


    var private_key_input = new Input();
    MainPage.private_key_input = private_key_input;
    private_key_input.size(MainPage.calc_percent(0,60),40);
    private_key_input.x = eth_label.x + eth_label.width + 30;
    private_key_input.y = MainPage.calc_percent(1,50);
    private_key_input.fontSize = key_size;
    private_key_input.color = '#fff';
    private_key_input.bgColor = '#000'
    account_node.addChild(private_key_input);


    var random_address_button = new laya.display.Sprite();
    random_address_button.loadImage(Resource.random_address);
    GCSHelper.center_sprite(random_address_button);
    random_address_button.y = private_key_input.y + 100;
    account_node.addChild(random_address_button);

    var confirm_address_button = new laya.display.Sprite();
    MainPage.confirm_address_button = confirm_address_button;
    confirm_address_button.loadImage(Resource.confirm_address);
    GCSHelper.center_sprite(confirm_address_button);
    confirm_address_button.y = random_address_button.y + random_address_button.height + 30;
    confirm_address_button.visible = false;
    account_node.addChild(confirm_address_button);

    
    confirm_address_button.on('click',MainPage,MainPage.confirm_address);
    random_address_button.on('click',MainPage,MainPage.random_address);

    MainPage.root_node.addChild(account_node);
    


}


/*
    随机生成地址
*/
MainPage.random_address = function(){
    var random_memo = ETHBip.random_mnemonic;
    var obj = ETHBip.gen_account(random_memo);
    MainPage.eth_input.text = obj.addr;
    MainPage.private_key_input.text = obj.wif;
    MainPage.confirm_address_button.visible = true;
}


/*
    确定使用地址
*/
MainPage.confirm_address = function(){
    var info = {};
    info.addr = MainPage.eth_input.text;
    info.wif = MainPage.private_key_input.text;
    GCSHelper.save_account_info(info);

    //跳转到首页
    MainPage.account_node.visible = false;
    MainPage.show_account_page();
}

/*
    选项界面
*/
MainPage.create_option_page = function(){

    MainPage.option_node = new laya.display.Sprite();
    var option_node = MainPage.option_node;

    var import_account_button = new laya.display.Sprite();
    import_account_button.loadImage(Resource.import_button);
    GCSHelper.center_sprite(import_account_button);
    import_account_button.x = GCSHelper.get_stage_width() * 0.25;
    option_node.addChild(import_account_button);
    import_account_button.on('click',MainPage,MainPage.import_account_page)


    var new_account_button = new laya.display.Sprite();
    new_account_button.loadImage(Resource.new_account);
    GCSHelper.center_sprite(new_account_button);
    new_account_button.x = GCSHelper.get_stage_width() * 0.55;
    option_node.addChild(new_account_button);

    new_account_button.on('click',MainPage,MainPage.open_new_account_subpage);

    MainPage.root_node.addChild(option_node);
}

MainPage.open_new_account_subpage = function(){
    MainPage.option_node.visible = false;
    if(MainPage.account_node == undefined){
        MainPage.create_newAccount_page();
    }
    else{
        MainPage.account_node.visible = true;
    }
}


MainPage.close_self = function(){
    MainPage.root_node.visible = false;
    var short_cuts = require('./short_cuts');
    short_cuts.show_self();
    
    if(MainPage.close_cb != undefined){
        MainPage.close_cb.apply();
    }

}

MainPage.create_main_account_page = function(){
    MainPage.account_main_node = new laya.display.Sprite();
    var Text = Laya.Text;


    var loading_text = new Text();
    loading_text.color = '#fff';
    loading_text.fontSize = 30;
    loading_text.text = '从链上取回数据中'
    GCSHelper.center_sprite(loading_text);
    MainPage.account_main_node.addChild(loading_text);

    var account_info = new Text();
    account_info.color = '#fff';
    account_info.fontSize = 20;
    account_info.text = GCSHelper.get_default_account();
    GCSHelper.center_sprite(account_info);
    account_info.y = account_info.y - 100;
    MainPage.account_main_node.addChild(account_info);


    var balance_value = new Text();
    balance_value.color = '#fff';
    balance_value.text = '';
    balance_value.fontSize = 30;
    balance_value.visible = false;
    
    
    MainPage.account_main_node.addChild(balance_value);


    //var export_private_key = new laya.display.Sprite();



    //todo 查询余额
    var self_account = GCSHelper.get_default_account();
    var web3 = GCSHelper.getWeb3Instance();
    web3.eth.getBalance(GCSHelper.get_default_account(),function(err,data){
    
        var balance = data.toNumber();
        balance = web3.fromWei(balance,'ether');
        var float_balance = parseFloat(balance).toFixed(6);
        console.log('余额',balance);
        loading_text.visible = false;
        balance_value.text = float_balance + ' ETH';
        balance_value.align = 'center';
        GCSHelper.center_sprite(balance_value);
        balance_value.y = balance_value.y - 50;
        balance_value.visible = true;
        
    })    


    




    MainPage.root_node.addChild(MainPage.account_main_node);
    
}

MainPage.show_account_page = function(){
    if(MainPage.account_main_node == undefined){
        MainPage.create_main_account_page()
    }
}

module.exports = MainPage;
