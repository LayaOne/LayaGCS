/*
    全局小图标
*/

var MainPage = require('./main_page');

var LayaShortCuts = {};

LayaShortCuts.initlize = function(stage_node){

    var Resource = require('../gsc_assets').res;
    LayaShortCuts.stage_node = stage_node;

    var short_cuts_button = new laya.display.Sprite();
    LayaShortCuts.short_cuts_button = short_cuts_button;
    short_cuts_button.loadImage(Resource.short_cut_logo);
    short_cuts_button.x = 0;
    short_cuts_button.y = 0;
    short_cuts_button.alpha = 0.7;
    stage_node.addChild(short_cuts_button);

    short_cuts_button.on('click',LayaShortCuts,LayaShortCuts.onClick);
    short_cuts_button.on('dragstart',LayaShortCuts,LayaShortCuts.drag_start);
    short_cuts_button.on('dragend',LayaShortCuts,LayaShortCuts.drag_end);


    short_cuts_button.on('mousedown',LayaShortCuts,LayaShortCuts.on_mouse_down);
}


LayaShortCuts.on_mouse_down = function(){
    console.log('on_mouse_down');
    LayaShortCuts.short_cuts_button.alpha = 1;
    LayaShortCuts.short_cuts_button.startDrag();
}


/*
    浮层游标被点击
*/
LayaShortCuts.onClick = function(){
    //console.log('浮层游标被点击');
    MainPage.show_self(LayaShortCuts.stage_node);
    LayaShortCuts.hide_self();
}

LayaShortCuts.hide_self = function(){
    LayaShortCuts.short_cuts_button.visible = false;
}

LayaShortCuts.show_self = function(){
    LayaShortCuts.short_cuts_button.visible = true;
}


LayaShortCuts.drag_start = function(){
    console.log('drag_start');
}


/*
    结束拖动
*/

LayaShortCuts.drag_end = function(){
    console.log('drag_end');
    LayaShortCuts.return_postion();
}


LayaShortCuts.return_postion = function(){

    var short_cuts_button = LayaShortCuts.short_cuts_button;

    var x = LayaShortCuts.short_cuts_button.x;
    var y = LayaShortCuts.short_cuts_button.y;

    var width = LayaShortCuts.stage_node.width;
    var height = LayaShortCuts.stage_node.height;

    var final_x, final_y;

    if(x > width * 0.5){
        final_x = width - short_cuts_button.width ;
    }
    else{
        final_x = 0;
    }

    if( y > height * 0.5){
        final_y = height - short_cuts_button.height ;
    }
    else{
        final_y = 0;
    }

    Laya.Tween.to(short_cuts_button,{
        x:final_x,
        y:final_y,
        alpha:0.7
    },400,Laya.Ease.linearIn,null,0)


}


module.exports = LayaShortCuts;