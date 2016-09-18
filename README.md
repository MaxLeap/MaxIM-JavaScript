# MaxIM-Javascript V4

## 如何使用

V4版SDK遵循UMD规范, 兼容NodeJS和浏览器端。

**旧版SDK仍可使用, 但已经不再维护, 如需使用最新功能, 请尽快迁移到V4版**

您可以使用如下方式集成SDK:

### 使用NPM (NodeJS)

```shell
$ npm install maxleap-im --save
```

然后如下方式加载:

``` javascript
var IM = require('maxleap-im');
var options = {
  app: 'YOUR_APP_ID', // 应用ID
  key: 'YOUR_API_KEY'  // 应用密钥
};
var im = IM(options);
// ......
```

### 使用bower (浏览器)

首先通过bower来安装依赖:

``` shell
$ bower install maxleap-im --save
```

接着使用requirejs来载入:

``` javascript

// 初始化requirejs

require.config({
  paths: {
    'socket.io-client': 'bower_components/socket.io-client/socket.io',
    'fetch': 'bower_components/fetch/fetch',
    'isomorphic-fetch': 'bower_components/isomorphic-fetch/fetch-bower',
    'maxleap-im': 'bower_components/maxleap-im/dist'
  }
});

require(['maxleap-im/im'],function(IM){
  var opts = {
    app: 'YOUR_APP_ID',
      key: 'YOUR_APP_KEY'
  };
    
  var im = IM(opts); // 或者 ML.im(opts)
   // ......
});

```

### 入门

以下为入门样例代码, 更高级的功能请参考下文的[API文档](#api文档)。

``` javascript
    // 通过上文的方式初始化MaxIM实例
    im.login()
      .simple('12345678')
      .ok(function(error,session,context){
        if(error){
          console.error('login failed: %s',error.message);
          return;
        }
        
        context.listFriends(function(err,friends){
            // process response
        });
        
        session
          .say('hello world!').toFriend('87654321') // first message
          .ok()
          .say('http://www.xxxxx.com/xxxx.jpg').asImage().toGroup('group1234') // second message
          .ok(function(error){
            session.close(function(error){
              console.log('goodbye!');
            });
          });
    });
```

## API文档

### IM(opts:Object):[MaxIM](#maxim)
--------------------------------------------------

调用后对于给定的设置项初始化一个`MaxIM`实例, 该实例可以全局用于控制各种内部服务操作。`opts`设置项包含以下配置:

| 属性名 | 类型 | 说明 | 默认值 |
|-------|-------|-------|-------|
| app | string (required) | 应用ID, 您可以控制台的应用设置中找到 | |
| key | string (required) | 应用密钥, 您可以控制台的应用设置中找到 | |
| region | string (optional) | 服务器区域, 目前包含: cn(中国区), us(美国区) | 'cn' |
| useHttp | boolean (optional) | 当设置为true时, 客户端会使用http进行连接 (默认使用https) | false |

### MaxIM
--------------------------------------------------

> 核心入口类

#### MaxIM#login():[Login](#login)

初始化并返回一个登录器。登录器可被用于进一步登录操作。

#### MaxIM#admin():[Admin](#admin)

初始化并返回一个管理器实例。管理器拥有最高级别的控制权限, 通常被用于一些系统级的控制操作。

### Login
--------------------------------------------------

> 登录器, 可进行登录设置并创建会话。

#### Login#simple(userid:string):[SessionBuilder](#sessionbuilder)

使用简单方式登录并返回一个session构造器实例。该登录方式仅需要一个用户ID唯一标识即可。安全级别低, 建议使用高级别的登录方式。

#### Login#byMaxleapUser(username:string,password:string):[SessionBuilder](#sessionbuilder)

使用MaxLeap自带的账号系统登录并返回一个session构造器实例。该登录方式比较安全, 推荐使用, 您只需传统的用户名+密码方式即可登录。

如果您对MaxLeap自带账号系统不太熟悉, 这里是[文档传送门](https://maxleap.cn/s/web/zh_cn/guide/usermanual/accountsystem.html)。

#### Login#byPhone(phone:string,verify:string):[SessionBuilder](#sessionbuilder)

使用MaxLeap的短信验证方式登录并返回一个session构造器实例。该登录方式比较安全, 推荐使用。关于如何使用MaxLeap短信验证, 请参阅[传送门](https://maxleap.cn/s/web/zh_cn/guide/usermanual/accountsystem.html#账号服务-短信验证码验证)。

### SessionBuilder
--------------------------------------------------

> session构造器, 用于初始化session设置, 绑定各种事件, 并进行登录调用。
> 该类中的设置接口使用流畅接口风格, 您可以进行链式设置并最后调用`ok`进行最终提交创建。

#### SessionBuilder#setNotifyAll(enable:boolean):[SessionBuilder](#sessionbuilder)

启用在线/离线通知给所有人(默认禁用)。启用后该用户的上下线状态对于非好友的应用内用户也会进行状态通知。该特性可以被用于例如客服，专家问答系统等。

#### SessionBuilder#setInstallation(installation:string):[SessionBuilder](#sessionbuilder)

设置应用安装ID。应用安装ID唯一标识一台设备的一次应用安装, 该标识将被用于离线消息推送时确认唯一身份。

#### SessionBuilder#onFriendMessage(callback:(userid,message)=>void):[SessionBuilder](#sessionbuilder)

绑定好友消息源。绑定该事件后, 所有来自您的好友的消息都会回调。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | userid | string | 好友的用户ID | |
| 2 | message | [BasicMessage](#basicmessage) | 消息体 |

#### SessionBuilder#onGroupMessage(callback:(groupid,memberid,message)=>void):[SessionBuilder](#sessionbuilder)
 
绑定群组消息源。绑定该事件后, 所有来自您当前已加入的群组内消息都会进行回调。其中回调句柄的参数用法:
 
| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | groupid | string | 群组标识ID | |
| 2 | memberid | string | 本消息的群组内发言人标识ID | |
| 3 | message | [BasicMessage](#basicmessage) | 消息体 |

#### SessionBuilder#onRoomMessage(callback:(roomid,memberid,message)=>void):[SessionBuilder](#sessionbuilder)

绑定聊天室消息源。绑定该事件后, 所有来自您当前已加入的聊天室内的消息都会进行回调。其中回调句柄的参数用法为:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | roomid | string | 聊天室标识ID | |
| 2 | memberid | string | 本消息的聊天室内发言人标识ID | |
| 3 | message | [BasicMessage](#basicmessage) | 消息体 |

#### SessionBuilder#onPassengerMessage(callback:(passengerid,message)=>void):[SessionBuilder](#sessionbuilder)

绑定来自访客的消息源。绑定该事件后, 所有来自未注册临时访客发送给您的消息都会进行回调。其中回调句柄的参数用法为:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | passengerid | string | 访客标识ID | |
| 2 | message | [BasicMessage](#basicmessage) | 消息体 |

#### SessionBuilder#onStrangerMessage(callback:(strangerid,message)=>void):[SessionBuilder](#sessionbuilder)

绑定来自陌生人的消息源。绑定该事件后, 所有来自陌生人发送给您的消息都会进行回调。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | strangerid | string | 陌生人用户标识ID | |
| 2 | message | [BasicMessage](#basicmessage) | 消息体 | |

#### SessionBuilder#onSystemMessage(callback:(message)=>void):[SessionBuilder](#sessionbuilder)

绑定系统消息源。绑定该事件后, 所有的系统消息都会进行回调。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | message | SystemMessage | 消息体 |

#### SessionBuilder#onYourself(callback:(message)=>void):[SessionBuilder](#sessionbuilder)

当您在多个终端登录后, 您可以绑定来自其他终端的另一个"你"发送的消息。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | message | YourselfMessage | 消息体 |

#### SessionBuilder#onFriendOnline(callback:(friendid)=>void):[SessionBuilder](#sessionbuilder)

绑定好友上线通知。绑定事件后, 当您的某个好友上线时您会收到通知并回调。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | friendid | string | 好友的用户ID |

#### SessionBuilder#onFriendOffline(callback:(friendid)=>void):[SessionBuilder](#sessionbuilder)

绑定好友离线通知。绑定事件后, 当您的某个好友离线时您会收到通知并回调。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | friendid | string | 好友的用户ID |

#### SessionBuilder#onStrangerOnline(callback:(strangerid)=>void):[SessionBuilder](#sessionbuilder)

绑定陌生人上线通知。绑定事件后, 当某个非好友用户上线时您会收到通知并回调, **注意: 仅当对方`setNotifyAll`设置为`true`时才会生效**。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | strangerid | string | 陌生人用户ID |

#### SessionBuilder#onStrangerOffline(callback:(strangerid)=>void):[SessionBuilder](#sessionbuilder)

绑定陌生人离线通知。绑定事件后, 当某个非好友用户离线时您会收到通知并回调, **注意: 仅当对方`setNotifyAll`设置为`true`时才会生效**。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | strangerid | string | 陌生人用户ID |

#### SessionBuilder#ok(callback:(error,session,context)=>void)

结束退出构造器调用链, 您可在回调句柄中获取到session创建结果。回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 异常对象, 仅当session创建失败时非空 |
| 2 | session | [Session](#session) | Session对象 |
| 3 | context | [Context](#context) | 用户上下文, 用于控制当前登录用户的私有操作 |

### Session
--------------------------------------------------

> 用户登录会话, 该会话与服务器维持一个长连接, 您可以通过该类内的API进行核心的消息收发。

#### Session#current():string

返回当前登录用户ID。

#### Session#say(text:string,remark?:string):[MessageBuilder](#messagebuilder)

新建一个消息构造器实例。消息构造器可以用于构建设置并最终发送消息。`text`为您的消息文本(必填项), `remark`为本条消息的备注信息(可选项)。

#### Session#close(callback:(error)=>void)

关闭并销毁用户登录会话。当关闭失败时回调参数中会返回`error`对象。


### MessageBuilder
--------------------------------------------------

> 消息构造器, 用于构造并最终发送消息。

#### MessageBuilder#asText():[MessageBuilder](#messagebuilder)

将本条消息媒体类型设置为纯文本并返回原实例。

#### MessageBuilder#asImage():[MessageBuilder](#messagebuilder)

将本条消息媒体类型设置为图片并返回原实例。

#### MessageBuilder#asAudio():[MessageBuilder](#messagebuilder)

将本条消息媒体类型设置为音频并返回原实例。

#### MessageBuilder#asVideo():[MessageBuilder](#messagebuilder)

将本条消息媒体类型设置为视频并返回原实例。

#### MessageBuilder#disablePush():[MessageBuilder](#messagebuilder)

设置本条消息禁用推送功能并返回原实例。

#### MessageBuilder#setPushPrefix(prefix:string):[MessageBuilder](#messagebuilder)

设置本条消息的推送文本前缀并返回原实例。

#### MessageBuilder#setPushSuffix(suffix:string):[MessageBuilder](#messagebuilder)

设置本条消息的推送文本后缀并返回原实例。

#### MessageBuilder#setPushTextOverwrite(overwrite:string):[MessageBuilder](#messagebuilder)

覆盖设置本条消息的推送消息文本, 设置后原本的消息文本将会被替换。

#### MessageBuilder#setPushSound(sound:string):[MessageBuilder](#messagebuilder)

设置本条消息的推送铃声并返回原实例。**注意: 仅限IOS设备**

#### MessageBuilder#setPushContentAvailable(contentAvailable:boolean):[MessageBuilder](#messagebuilder)

设置本条消息的`content-avaliable`并返回原实例。**注意: 仅限IOS设备**

#### MessageBuilder#toAll():[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为所有人并返回消息发射器。`**注意: 仅限Admin使用, 用于向所有人发送系统消息!!!**

#### MessageBuilder#toFriend(friendid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为好友并返回消息发射器。`friendid`为好友的用户ID。

#### MessageBuilder#toGroup(groupid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为群组并返回消息发射器。`groupid`为群组ID。

#### MessageBuilder#toRoom(roomid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为聊天室并返回消息发射器。`roomid`为聊天室ID。

#### MessageBuilder#toPassenger(passengerid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为访客并返回消息发射器。`passengerid`为访客ID。

#### MessageBuilder#toStranger(strangerid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为陌生人并返回消息发射器。`strangerid`为陌生人用户ID。

### MessageLauncher
--------------------------------------------------

> 消息发射器, 提交并最后发射消息。

#### MessageLauncher#ok(callback:(error)=>void):[Sessiion](#session)

发射消息并返回用户登录会话。当发射发生错误时, 回调句柄中的`error`对象会包含错误详情。

### Admin
----------------------------------------------------

> 管理类, 包含最高权限的一些操作封装。

#### Admin#say(text:string,remark:string):[MessageBuilder](#messagebuilder)

新建一个系统消息构造器实例。系统消息构造器可以用于构建设置并最终发送消息。`text`为您的消息文本(必填项), `remark`为本条消息的备注信息(可选项)。

#### Admin#setAttributes(attributes:Object,overwrite:boolean):[AttributeBuilder](#attributebuilder)

新建一个属性构造器实例。

#### Admin#create():[CreateCommand](#createcommand)

新建一个空白创建命令实例。您可以通过该命令来生成各种对象。

#### Admin#destroy():[DestroyCommand](#destroycommand)

新建一个空白的销毁命令实例。您可以通过该销毁命令来销毁各种对象。

#### Admin#appendMembers(first:string,others:string...):[MemberAppendCommand](#memberappendcommand)

新建一个成员追加命令。

#### Admin#removeMembers(first:string,others:string...):[MemberRemoveCommand](#memberremovecommand)

新建一个成员移除命令。

### AttributeBuilder
----------------------------------------

> 属性构造器, 用于设置对象自定义属性。

#### AttributeBuilder#forUser(userid:string,callback:(error)=>void):[Admin](#admin)

将设置的属性应用于指定的用户。

#### AttributeBuilder#forGroup(groupid:string,callback:(error)=>void):[Admin](#admin)

将设置的属性应用于指定的群组。

#### AttributeBuilder#forRoom(roomid:string,callback:(error)=>void):[Admin](#admin)

将设置的属性应用于指定的聊天室。

### CreateCommand
---------------------------------------------

> 对象创建命令。

#### CreateCommand#group(owner:string):[GroupBuilder](#groupbuilder)

新建并返回一个群组构造器, `owner`为群组创建者ID。

#### CreateCommand#room():[RoomBuilder](#roombuilder)

新建并返回一个聊天室构造器。

### GroupBuilder
-------------------------------------------------

> 群组构造器, 用于生成新的群组。

#### GroupBuilder#attribute(key:string,value:Object):[GroupBuilder](#groupbuilder)

设置群组属性。

#### GroupBuilder#members(first:string,others:string...):[GroupBuilder](#groupbuilder)

设置群组成员。

#### GroupBuilder#ok(callback:(error,groupid)=>void):[Admin](#admin)

结束链式调用, 提交并创建群组并返回起始`Admin`对象。

### RoomBuilder
-------------------------------------------------

> 聊天室构造器, 用于生成新的聊天室。

#### RoomBuilder#attribute(key:string,value:Object):[RoomBuilder](#roombuilder)

设置聊天室属性。

#### RoomBuilder#members(first:string,others:string...):[RoomBuilder](#roombuilder)

设置聊天室成员。

#### RoomBuilder#ok(callback:(error,roomid)=>void):[Admin](#admin)

结束链式调用, 提交并创建聊天室并返回起始`Admin`对象。


### DestroyCommand
----------------------------------------------

> 对象销毁命令。用于销毁指定对象。

#### DestroyCommand#group(groupid:string):[GroupDestroy](#groupdestroy)

销毁群组。

#### DestroyCommand#room(roomid:string):[RoomDestroy](#roomdestroy)

销毁聊天室。


### GroupDestroy
-------------------------------------------------

> 群组销毁器。

#### GroupDestroy#ok(callback:(error)=>void):[Admin](#admin)

结束链式调用, 提交销毁群组并返回起始`Admin`对象。

### RoomDestroy
-------------------------------------------------

> 聊天室销毁器。

#### RoomDestroy#ok(callback:(error)=>void):[Admin](#admin)

结束链式调用, 提交销毁聊天室并返回起始`Admin`对象。

### MemberAppendCommand
-------------------------------------------------

> 追加成员命令。用于向指定对象追加成员。

#### MemberAppendCommand#intoGroup(groupid:string,callback:(error)=>void):[Admin](#admin)

结束链式调用, 将成员加入至群组并返回原始`Admin`实例。

#### MemberAppendCommand#intoRoom(roomid:string,callback:(error)=>void):[Admin](#admin)

结束链式调用, 将成员加入至聊天室内并返回原始`Admin`实例。

### MemberRemoveCommand
-------------------------------------------------

> 移除成员命令。用于移除指定对象内的成员。

#### MemberRemoveCommand#fromGroup(groupid:string,callback:(error)=>void):[Admin](#admin)

结束链式调用, 移除群组成员并返回原始`Admin`实例。

#### MemberRemoveCommand#fromRoom(roomid:string,callback:(error)=>void):[Admin](#admin)

结束链式调用, 移除聊天室成员并返回原始`Admin`实例。

### BasicMessage
---------------------------
基础消息结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| content | [Content](#content) | 消息正文 |
| ts | number | 消息送达时间戳 |
| remark | string | 消息备注(可选项) |

### Content
------------------------------
消息正文结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| media | number | 媒体类型: 0=纯文本, 1=图片, 2=音频, 3=视频 |
| body | string | 正文文本 |