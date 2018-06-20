var TxPage = {};
var GCSHelper = require('../gcs_helper');
var Resource = require('../gsc_assets').res;


TxPage.show_page = function(single_tx){

    TxPage.current_tx = single_tx;
    var params = single_tx.params[0];
    TxPage.root_node = new laya.display.Sprite();
    
    var root_node = TxPage.root_node;
    GCSHelper.generate_base_element(root_node);

    var Text = Laya.Text;
    var FromLabel = new Text();
    FromLabel.color = '#ffffff';
    FromLabel.fontSize = 30;
    FromLabel.text = 'From'
    FromLabel.align = 'center';
    
    FromLabel.x = Laya.stage.width * 0.15;
    FromLabel.y = 230;
    root_node.addChild(FromLabel);

    
  

    var ToLabel = new Text();
    ToLabel.color = '#ffffff';
    ToLabel.fontSize = 30;
    ToLabel.align = 'center'
    ToLabel.text = 'To'
    ToLabel.x = Laya.stage.width  - (Laya.stage.width * 0.15 + ToLabel.width) ;
    ToLabel.y = 230;
    root_node.addChild(ToLabel);




    var FromAddressLabel = new Text();
    FromAddressLabel.color = '#fff';
    FromAddressLabel.fontSize = 30;
    FromAddressLabel.text = TxPage.format_address(params.from);
    FromAddressLabel.align = 'center';
    FromAddressLabel.x = Laya.stage.width * 0.15;
    FromAddressLabel.y = 300;
    root_node.addChild(FromAddressLabel);

    var ToAddressLabel = new Text();
    ToAddressLabel.color = '#fff';
    ToAddressLabel.fontSize = 30;
    ToAddressLabel.text = TxPage.format_address(params.to);
    ToAddressLabel.align = 'center';
    ToAddressLabel.x = Laya.stage.width - (Laya.stage.width * 0.15 + ToAddressLabel.width ) ;
    ToAddressLabel.y = 300;
    root_node.addChild(ToAddressLabel);


    var TransValueLabel = new Text();
    TransValueLabel.color = '#fff';
    TransValueLabel.fontSize = 40;
    
    if(params.value == undefined){
        params.value = 0;
    }
    TransValueLabel.text = params.value + ' ETH';
    TransValueLabel.align = 'center';
    GCSHelper.center_sprite(TransValueLabel);
    TransValueLabel.y = 80;
    root_node.addChild(TransValueLabel);

    var green_arrow = new laya.display.Sprite();
    green_arrow.loadImage(Resource.green_arrow);
    GCSHelper.center_sprite(green_arrow);
    green_arrow.y = 180;
    root_node.addChild(green_arrow);


    var confirm_tx = new laya.display.Sprite();
    confirm_tx.loadImage(Resource.confirm);
    confirm_tx.x = Laya.stage.width *0.2 ;
    confirm_tx.y = Laya.stage.height * 0.75;
    root_node.addChild(confirm_tx);


    var reject_tx = new laya.display.Sprite();
    reject_tx.loadImage(Resource.reject);
    reject_tx.x = Laya.stage.width - (Laya.stage.width * 0.2 + reject_tx.width);
    reject_tx.y = Laya.stage.height * 0.75;
    root_node.addChild(reject_tx);

    confirm_tx.on('click' , TxPage , TxPage.onConfirm)
    reject_tx.on('click',TxPage,TxPage.onReject);

    GCSHelper.get_game_stage().addChild(root_node);
    

}

TxPage.hide_self = function(){
    TxPage.root_node.removeSelf();
}


TxPage.onConfirm = function(){

    //todo rawtransaction
    var tx_info = TxPage.current_tx;


}

TxPage.onReject = function(){
    var tx_info = TxPage.current_tx;
    var HookManager = require('../hook_manager');
    HookManager.on_opreate();
    tx_info.callback("User rejected transaction",null);
}



TxPage.format_address = function(address){

    if(address == undefined){
        return "";
    }

    var start = 8;
    var end = 4;
    var head = address.substring(0,start);
    var middle = '....';
    var tail = address.substring(address.length - end, address.length);
    return head + middle + tail;

}

module.exports = TxPage;