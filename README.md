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

### 相关文档

后续发布

### 运行截图

![](https://simg1.zhubaijia.com/UC20180609_114822.png)


![](https://simg1.zhubaijia.com/UC20180612_150501.png)


![](https://simg1.zhubaijia.com/UC20180612_150529.png)


![](https://simg1.zhubaijia.com/UC20180608_190857.png)

