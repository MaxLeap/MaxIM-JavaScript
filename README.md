# MaxIM-Javascript V4

## 如何使用

V4版SDK遵循UMD规范, 兼容NodeJS和浏览器端。

**旧版SDK仍可使用, 但已经不再维护, 如需使用最新功能, 请尽快迁移到V4版**

您可以使用如下方式集成SDK:

1. 使用NPM

```shell
$ npm install maxleap-im --save
```

然后如下方式加载:

``` javascript
var IM = require('maxleap-im');
var options = {
  app: 'YOUR_APP_ID', // 应用ID
  key: 'YOUR_API_KEY',  // 应用密钥
  region: 'cn | us', // 服务器区域, 默认为中国区。 (可选项)
  useHttp: true // 是否强制使用HTTP, 默认使用HTTPS。(可选项)
};
var maxim = IM(options);
```

2. 使用bower

``` shell
$ bower install maxleap-im --save
```

您需要使用requirejs来载入:

``` javascript
require('maxleap-im');

```

## API文档

### IM(opts:Object):MaxIM

调用后对于给定的设置项初始化一个`MaxIM`实例, 该实例可以全局用于控制各种内部服务操作。`opts`设置项包含以下配置:

| 属性名 | 类型 | 说明 | 默认值 |
|-------|-------|-------|-------|
| app | string (required) | 应用ID, 您可以控制台的应用设置中找到 | |
| key | string (required) | 应用密钥, 您可以控制台的应用设置中找到 | |
| region | string (optional) | 服务器区域, 目前包含: cn(中国区), us(美国区) | 'cn' |
| useHttp | boolean (optional) | 当设置为true时, 客户端会使用http进行连接 (默认使用https) | false |

### MaxIM#login():Login

初始化并返回一个登录器。登录器可被用于进一步登录操作。

### MaxIM#admin():Admin

初始化并返回一个管理器实例。管理器拥有最高级别的控制权限, 通常被用于一些系统级的控制操作。

### Login#simple(userid:string):SessionBuilder

使用简单方式登录并返回一个session构造器实例。该登录方式仅需要一个用户ID唯一标识即可。安全级别低, 建议使用高级别的登录方式。

### Login#byMaxleapUser(username:string,password:string):SessionBuilder

使用MaxLeap自带的账号系统登录并返回一个session构造器实例。该登录方式比较安全, 推荐使用, 您只需传统的用户名+密码方式即可登录。

如果您对MaxLeap自带账号系统不太熟悉, 这里是[文档传送门](https://maxleap.cn/s/web/zh_cn/guide/usermanual/accountsystem.html)。

### Login#byPhone(phone:string,verify:string):SessionBuilder

使用MaxLeap的短信验证方式登录并返回一个session构造器实例。该登录方式比较安全, 推荐使用。关于如何使用MaxLeap短信验证, 请参阅[传送门](https://maxleap.cn/s/web/zh_cn/guide/usermanual/accountsystem.html#账号服务-短信验证码验证)。

### SessionBuilder

session构造器, 用于初始化session设置, 绑定各种事件, 并进行登录调用。



