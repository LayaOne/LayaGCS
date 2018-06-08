var LoginPage = {};



LoginPage.get_page = function(game_stage){
    if(!LoginPage.root_node){
        LoginPage.root_node = new laya.display.Sprite();

        var root_node = LoginPage.root_node;

        //黑色透明遮罩
        var black_bg = new laya.display.Sprite();
        root_node.addChild(black_bg);

        var game_width = game_stage.width;
        var game_height = game_stage.height;

        black_bg.graphics.drawRect(0,0,game_width,game_height,'#2F2B2B');
        black_bg.alpha = 0.8


    }

    return LoginPage.root_node;
}

module.exports = LoginPage;