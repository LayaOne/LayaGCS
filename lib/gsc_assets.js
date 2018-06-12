var GSCAssets = {};

GSCAssets.CDN_URL = 'http://game.loocall.com/layagsc/'

GSCAssets.res = {};
GSCAssets.res.close_button = 'close.png';
GSCAssets.res.short_cut_logo = 'logo.png';
GSCAssets.res.import_button = 'import_button.png';
GSCAssets.res.new_account = 'newAccount.png';
GSCAssets.res.history_button = 'history.png';
GSCAssets.res.green_arrow = 'green_arrow.png';
GSCAssets.res.exit_button = 'exit.png';
GSCAssets.res.confirm = 'confirm.png';
GSCAssets.res.reject = 'reject.png';


GSCAssets.sdk_assets = [];

GSCAssets.initlize = function(){


    if(typeof Laya === undefined){
        console.log('Not Loaded Laya Envirment')
        return;
    }
    
    for(var i in GSCAssets.res){
        var res_name = GSCAssets.res[i];
        GSCAssets.res[i] = GSCAssets.CDN_URL + res_name;
        var single_assets = {};
        single_assets.url = GSCAssets.res[i];
        single_assets.type = laya.net.Loader.IMAGE;
        GSCAssets.sdk_assets.push(single_assets);
    }
}


GSCAssets.initlize();



module.exports = GSCAssets;