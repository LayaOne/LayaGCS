# LayaGCS ( Laya Game Chain SDK)

LayaGCS是一个基于ETH的链互SDK，内置了钱包功能，智能合约调用，web3实例，以及一些基础界面，可以非常方便的让H5游戏接入。

LayaGCS运行需要Laya Air环境（请参阅https://www.layabox.com/)


# Installation

``npm install layagcs``


# Hello LayaGCS

> 初始化

```javascript

    var LayaGCS = require('layagcs');

    //初始化Laya Air环境
    var SCREEN_WIDTH = 1136;
	var SCREEN_HEIGHT = 640;
    Laya.init(SCREEN_WIDTH, SCREEN_HEIGHT,Laya.WebGL);
     
    //初始化Laya Game Chain SDK
    LayaGCS.initlize({
        laya_stage_node:laya.stage,     //Laya Air根节点
        network:0                       //ETH区块链网络（0位测试网络ropstenTestNet , 1为正式网络MainNet)
    })


```

# 使用例子

> 调用智能合约

```javascript

    var web3 = LayaGCS.web3;
	var wei = 1000000000000000000; // 10^18
	var gooAbi = require('./gooabi');

	var gooContract = web3.eth.contract(gooAbi).at('0x57b116da40f21f91aec57329ecb763d29c1b2355');

	if(LayaGCS.get_current_account() == undefined){
		LayaGCS.show_login_ui(Laya.stage);
		return;
	}

	/*
		测试读取合约数据
	*/	
	gooContract.getGameInfo(function (err, result) {
		var time = result[0].toNumber() * 1000;
		var totalPot = result[1].toNumber() / wei;
		var totalProduction = result[2].toNumber();
		var nextSnapshot = result[3].toNumber();
		var goo = result[4].toNumber();
		var ether = result[5].toNumber() / wei;
		var gooProduction = result[6].toNumber();
		var units = result[7];
		var upgrades = result[8];

		console.log('时间',time,"总pot",totalPot,"总生产",totalProduction,'下次快照',nextSnapshot,'Goo',goo,'Ether',ether.toFixed(8),'gooProduction',gooProduction)
		
	});


```

> 在调用写操作智能合约时，请务必保证LayaGCS.web3.eth.defaultAccount不为空





# Documentation

> 以下为LayaGCS的一些基础API，文档不断更新，详情关注 Laya.one 官网

## LayaGCS.initlize()

> 初始化SDK以及设置LayaGCS以哪种ETH网络工作，同时会少量加载一些LayaGCS的资源，此处必须传入 LayaAir的根节点

```javascript
    LayaGCS.initlize({
        laya_stage_node:laya.stage,     //Laya Air根节点
        network:0                       //ETH区块链网络（0位测试网络ropstenTestNet , 1为正式网络MainNet)
        auto_load_last_account:false    //自动读取上次登入的账户
    })
```

>初始化成功后，游戏会出现LayaGCS的浮层游标，如图

![](http://palu6iv0v.bkt.clouddn.com/laya_icon_play.gif)


## LayaGCS.get_current_account

> 得到当前ETH账户地址


# LayaGCS.set_inited_callback
> 设定加载完成回调

## LayaGCS.show_login_ui

> 弹出账号生成导入界面，在LayaGCS没有defualt_account时，会弹出导入界面，不然则弹出账户主页面

```javascript
if(LayaGCS.get_current_account() == undefined){
    LayaGCS.show_login_ui(Laya.stage);
    return;
}
```

## LayaGCS.web3

这是一个完整的web3实例。LayaGCS的web3有一些改动。

由于LayaOne提供了一个全节点，所以游戏前端无需同步区块数据

为了更好的游戏体验，LayaGCS.web3不再提供同步方法，例如

```javascript
var web3 = LayaGCS.web3
//原来同步的写法
var balance = web3.eth.getBalance(LayaGCS.get_default_account()); //同步的写法，LayaGCS不再支持
//异步调用方法co
co(function*(){
    var balance = yield function(done){
        web3.eth.getBalance(LayaGCS.get_default_account(),done)
    }

    console.log('账户余额为',balalnce)
})
//同样也支持async/await
//await web3.eth.getBlance() ...
```

LayaGCS.web3会拦截所有的method为eth_sendTransaction的异步方法，并自动为用户弹出交易确认界面



还是以``etherGoo``https://ethergoo.io/game/ 这个游戏举例，我们做一个白色按钮调用其合约【购买基础单位】

```javascript
    /*
		测试调用合约函数 - 购买基础单位
    */
    function test_call_contract(){
        gooContract.buyBasicUnit(1,1,function(err,res){
            if(err){
                console.log('购买失败',err);
            }
	    })
    }
	
```

![](http://palu6iv0v.bkt.clouddn.com/call_contract.gif)

当用户点击确认交易后，LayaGCS会将本次Transaction签名后，以sendRawTransaction发送至eth节点，然后由节点广播

> 相关合约您可以查阅``0x57b116da40f21f91aec57329ecb763d29c1b2355``



## GCS 运行截图

![](http://palu6iv0v.bkt.clouddn.com/UC20180620_140540.png)


![](http://palu6iv0v.bkt.clouddn.com/UC20180620_140626.png)


## 其他结构

> LayaGCS是整个Laya.one环节中的一部分

![](http://palu6iv0v.bkt.clouddn.com/UC20180620_125405.png)

LayaOne由Laya.cloud, laya.chain, laya.air, laya.maker等多个大模块组成


## 使用LAYA GSC开发的游戏结构

![](http://palu6iv0v.bkt.clouddn.com/UC20180620_125434.gif)



## Laya IDE

> Laya IDE集成了Truffle.js，可以非常方便的创建和部署智能合约，并提供了相应的智能合约模板

   
### LayaIDE界面

> 创建游戏（合约）

![](https://simg1.zhubaijia.com/UC20180604_154816.png)


> 编译合约

![](https://simg1.zhubaijia.com/UC20180604_160453.png)


> 校验签名

![](https://simg1.zhubaijia.com/UC20180604_160418.png)


> 部署合约

![](https://simg1.zhubaijia.com/UC20180604_161430.png)


### 关于Laya.One

IDE的发布以及更多模块请关注https://laya.one以及https://layabox.com
    
    




