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
        laya_stage_node:laya.stage
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

     封装一个eth解锁的统一UI，用于Unlock Eth Address

**地址导入**
    
     支持导入其他ETH地址，需要传入eth地址以及私钥


**为游戏环境提供 web3实例**

    GSC会将一些繁琐的操作封装，同时也全程对游戏提供web3的实例,开发者可以自行指定web3节点





### GSC API 设计

> 语法说明

> 所有函数采用小写+下划线连接的形式

> 通过npm进行安装 ``npm install LayaGSC --save``

> LayaGSC内部集成web3，理论上具备web3所有功能

> 允许外部拿到web3实例

    var LayaGSC = require('LayaGSC')

    LayaGSC.initlize( {provider_info }) //实例初始化，可选参数，指定web3节点，不写即使用GSC Server转发节点
    
    LayaGSC.show_login_ui() //显示ETH登录页面
    
    LayaGSC.unlock_account(address, wif) //解锁账户
    
    LayaGSC.call_contract_method(contract_address, {options} ,callback) //调用合约某函数，内部封装sendRawTransction
    
    LayaGSC.send_raw_transaction(signedTransactionData) //发送签名交易
    
    LayaGSC.get_web3_instance() //得到web3实例 也可以LayaGSC.web3.xxx()
    
    ...
    
    
    
    

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

