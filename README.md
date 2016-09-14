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
