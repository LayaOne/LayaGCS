var MainPage = {};
var GCSHelper = require('../gcs_helper');
var Resource = require('../gsc_assets').res;



MainPage.root_node = undefined;
MainPage.show_self = function(game_stage){

    if(!MainPage.root_node){
        MainPage.stage_node = game_stage;
        //创建MainPage
        MainPage.root_node = new laya.display.Sprite();
        var root_node = MainPage.root_node;

        GCSHelper.generate_base_element(root_node);
        var single_close_button_sprite = GCSHelper.get_a_close_button(root_node);
       
        single_close_button_sprite.on('click',MainPage,MainPage.close_self);

        
        MainPage.create_option_page();

        game_stage.addChild(root_node);

    }
    else{
        MainPage.root_node.visible = true;
    }
}

/*
    分配新地址界面
*/

MainPage.create_newAccount_page = function(){


    var account_node = new laya.display.Sprite();

    var Text = Laya.Text;
    var eth_label = new Text();
    eth_label.color = '#ffffff';
    eth_label.fontSize = 30;
    eth_label.text = 'ETH地址'
    


}


/*
    选项界面
*/
MainPage.create_option_page = function(){

    

    var import_account_button = new laya.display.Sprite();
    import_account_button.loadImage(Resource.import_button);
    GCSHelper.center_sprite(import_account_button);
    import_account_button.x = GCSHelper.get_stage_width() * 0.25;
    MainPage.root_node.addChild(import_account_button);

    var new_account_button = new laya.display.Sprite();
    new_account_button.loadImage(Resource.new_account);
    GCSHelper.center_sprite(new_account_button);
    new_account_button.x = GCSHelper.get_stage_width() * 0.55;
    MainPage.root_node.addChild(new_account_button);

}


MainPage.close_self = function(){
    MainPage.root_node.visible = false;
    var short_cuts = require('./short_cuts');
    short_cuts.show_self();

}

module.exports = MainPage;
