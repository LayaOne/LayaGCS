### LayaGCS ( Laya Game Chain SDK)

> 这是一个方便开发者使用LayaAir引擎迅速开发区块链游戏的扩展包

> 本SDK需要Laya Air的运行环境，且必须拥有 Laya Air环境才可以运行

> 更多请访问www.layabox.com


### usage

``npm install layagcs``

```javascript

    var LayaGCS = require('layagcs');

    //初始化Laya Air环境
    var SCREEN_WIDTH = 1136;
	var SCREEN_HEIGHT = 640;
    Laya.init(SCREEN_WIDTH, SCREEN_HEIGHT,Laya.WebGL);
     
    //初始化Laya Game Chain SDK

    LayaGCS.initlize({
        laya_stage_node:laya.stage,     //Laya Air根节点
        network:0                       //ETH区块链网络（0位测试网络ropstenTestNet , 1为正式网络)
    })
```

### 目前支持的公链

ETH


### 目标：

基于Laya IDE，可以快速创建一个接入ETH主链的区块链游戏，同时可以轻松一键部署、发布合约。


### 结构

```
 graph TD;
     S{GSC Server};
     N{ETH全节点};
     D{Laya GSC SDK}
     E{Laya IDE }
```


### 使用LAYA GSC开发的游戏结构

```
    graph TD;
    G(Laya Game)
    D(GSC SDK)
    S(GSC Server)
    E(ETH 节点)
    
    G -- import --> D
    D -- 链互操作 --> S
    S -- send Data --> E
    
```


### 功能点：

**1、创建智能合约**

    ERC20 Token发布模板

    EtherGoo 以太坊游戏模板

    用户选择相应的模板后，直接将预设合约代码展示出


**2、编译合约**

    IDE集成Truffle.js

    .sol文件互相之间支持import

    


**3、部署合约**

    
    流程：
    
    1、Laya IDE 弹出秘钥输入框，让与用户输入秘钥
    2、检测该地址eth余额是否满足gas消耗
    3、调用GSC的API,构建交易
    4、发送交易到GSC Server
    5、GSC Server转发到ETH全节点（这里封装一层的意思是不让用户直接连接节点）
    
    
    
    
    
    
**签名过程**

> 该过程等同于GSC在游戏中的链互操作流程

```
    sequenceDiagram
    LayaIDE->>GSC:调用GSC构造合约数据
    GSC->>GSC Server:构造签名交易并发送
    GSC Server->>ETH全节点:将数据转发给节点
    ETH全节点->>GSC:返回Txid
    
    
``` 




### 4、Metamask功能封装

说明：
> 现在近乎100%的eth区块链游戏使用Metamask浏览器插件（我没有见过其他的）

> Metamask是一个chrome浏览器钱包，同时向浏览器环境提供了web3的实例

> 如果想在手机上玩eth区块链游戏，是不能用metamask的。


所以GSC需要封装一套自己的类似metamask的功能，随游戏启动而启动。



**统一界面封装**

    导入ETH地址，钱包首页，交易列表，退出账户，导出私钥等操作的统一界面

**地址导入**
    
     支持导入其他ETH地址，需要传入eth地址以及私钥


**为游戏环境提供 web3实例**

    GSC会将一些繁琐的操作封装，同时也全程对游戏提供web3的实例。方便开发者调用智能合约等操作。





### GSC API 设计

> 语法说明

> 所有函数采用小写+下划线连接的形式

> 通过npm进行安装 ``npm install layagcs --save``

> LayaGSC内部集成web3，具备web3所有功能（部分挖矿功能不可开启）

> 由于是H5游戏，为了更好的用户体验，LayaGCS内部的Web3只支持``异步``调用的形式

> 详细参见web3的[中文文档](http://web3.tryblockchain.org/Web3.js-api-refrence.html#toc_43)

> LayaGCS详细文档尚未整理
    
    
    
    

### LayaIDE界面

> 创建游戏（合约）

![](https://simg1.zhubaijia.com/UC20180604_154816.png)


> 编译合约

![](https://simg1.zhubaijia.com/UC20180604_160453.png)


> 校验签名

![](https://simg1.zhubaijia.com/UC20180604_160418.png)


> 部署合约

![](https://simg1.zhubaijia.com/UC20180604_161430.png)



    
    
    
    




### 运行截图

![](https://simg1.zhubaijia.com/UC20180609_114822.png)


![](https://simg1.zhubaijia.com/UC20180612_150501.png)


![](https://simg1.zhubaijia.com/UC20180612_150529.png)


![](https://simg1.zhubaijia.com/UC20180608_190857.png)

