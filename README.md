# MaxIM-Javascript V4

**警告: 旧版SDK(v3.x.x)仍可使用, 但已经不再维护, 如需使用最新功能, 请尽快迁移到V4版**

## 如何使用

您可以使用如下方式集成SDK:

### 使用NPM

加载方式为CMD, 适用于NodeJS, 或者webpack等。使用范例如下。

首先用npm安装模块:

```shell
$ npm install maxleap-im --save
```

然后如下方式加载:

``` javascript
var IM = require('maxleap-im');
var options = {
  app: 'YOUR_APP_ID', // 应用ID, 参见应用设置的ApplicationID.
  key: 'YOUR_API_KEY'  // 应用密钥, 参见应用设置的ClientKey.
};
var im = IM(options);
// ......
```

### 使用Bower

加载方式为AMD, 浏览器端推荐。使用范例如下。

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
    'axios': 'bower_components/axios/dist/axios',
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
      .onFriendMessage(function(friendid,message){
        console.log('message from friend %s: %s',friendid,message.content.body);
      })
      .ok(function(error,session,context){
        if(error){
          console.error('login failed: %s',error.message);
          return;
        }

        context.listFriends(function(err,friends){
            // process response
        });

        // send text message.
        session
          .say('hello world!').toFriend('87654321')
          .ok();

        // upload image attachment and send it as image message.
        context.attachment(YOUR_IMG_FILE)
          .ok(function(err,urls){
              if(err){
                  console.error('upload file failed: %s',err.message);
                  return;
              }

              var origin= urls[0], thumb = urls[1];
              session.say(origin,thumb).asImage().toGroup('group1234')
                .ok(function(error){
                  session.close(function(error){
                    if(error){
                      console.error('logout failed: %s',error.message);
                      return;
                    }
                    console.log('goodbye!');
                  });
                });
          });

    });

    im.admin().create()
      .room()
      .attribute('name','OP fans')
      .attribute('location','Shanghai')
      .attribute('star',5)
      .members('cat','dog','fish')
      .ok(function(err,roomid){
          if(err){
            console.error('create room failed: %s',err.message);
            return;
          }
          console.log('create room success: %s',roomid);
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

#### MaxIM#passenger(passengerid:string):[PassengerBuilder](#passengerbuilder)

初始化并返回一个访客构造器。该构造器可以用于进一步访客模式登录操作。

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
| 1 | userid | string | 好友的用户ID |
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
| 1 | message | [BasicMessage](#basicmessage) | 消息体 |

#### SessionBuilder#onYourself(callback:(message)=>void):[SessionBuilder](#sessionbuilder)

当您在多个终端登录后, 您可以绑定来自其他终端的另一个"你"发送的消息。其中回调句柄的参数用法:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | message | [YourselfMessage](#yourselfmessage) | 消息体 |

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

设置本条消息的发送对象为所有人并返回消息发射器。**注意: 仅限Admin使用, 用于向所有人发送系统消息!!!**

#### MessageBuilder#toUser(userid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为单个普通用户并返回消息发射器。**注意: 仅限Admin和访客模式使用!!!**

#### MessageBuilder#toFriend(friendid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为好友并返回消息发射器。`friendid`为好友的用户ID。**注意: 仅限普通用户登录模式使用!!!**

#### MessageBuilder#toGroup(groupid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为群组并返回消息发射器。`groupid`为群组ID。**注意: 仅限Admin和普通用户登录模式使用!!!**

#### MessageBuilder#toRoom(roomid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为聊天室并返回消息发射器。`roomid`为聊天室ID。**注意: 仅限Admin和普通用户登录模式使用!!!**

#### MessageBuilder#toPassenger(passengerid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为访客并返回消息发射器。`passengerid`为访客ID。**注意: 仅限普通用户登录模式使用!!!**

#### MessageBuilder#toStranger(strangerid:string):[MessageLauncher](#messagelauncher)

设置本条消息的发送对象为陌生人并返回消息发射器。`strangerid`为陌生人用户ID。**注意: 仅限普通用户登录模式使用!!!**

### MessageLauncher
--------------------------------------------------

> 消息发射器, 提交并最后发射消息。

#### MessageLauncher#ok(callback:(error)=>void):[Session](#session)|[PassengerSession](#passengersession)

发射消息并返回用户登录会话。当发射发生错误时, 回调句柄中的`error`对象会包含错误详情。


### Context
--------------------------------------------------

> 用户上下文对象, 封装了针对当前登录用户的一些通用操作。

#### Context#listFriends(callback:(error,friends)=>void):[Context](#context)

列出当前用户的好友列表。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | friends | [Friend](#friend)[] | 好友列表(数组) |

#### Context#listGroups(callback:(error,groups)=>void):[Context](#context)

列出当前已加入的群组列表。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空。 |
| 2 | groups | [Group](#group)[] | 群组列表(数组) |

#### Context#listRooms(callback:(error,rooms)=>void):[Context](#context)

列出当前已加入的聊天室列表。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空。 |
| 2 | rooms | [Room](#room)[] | 聊天室列表(数组) |

#### Context#listStrangers(callback:(error,strangers)=>void,skip:number,limit:number):[Context](#context)

列出当前有关联的陌生人列表。`skip`和`limit`为可选项, 用于控制分页, 分别表示跳过记录数和返回记录条数。

回调函数`callback`的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空。 |
| 2 | strangers | [Stranger](#stranger)[] | 陌生人列表(数组) |

#### Context#listTalkings(endTimestamp:number,size:number):[TalkingBuilder](#talkingbuilder)

返回一个聊天记录查询器实例。该查询器可以被用于进一步的调用并最终获取聊天记录。方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | endTimestamp | number | 截止时间戳(毫秒), 可选项, 默认为当前时间戳 |
| 2 | size | number | 返回记录数, 可选项, 默认为20 |


#### Context#joinFriend(userid:string,callback:(error)=>void):[Context](#context)

添加好友。`userid`为被添加好友的用户ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#joinGroup(groupid:string,callback:(error)=>void):[Context](#context)

加入指定群组。`groupid`为要加入的群组ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#joinRoom(roomid:string,callback:(error)=>void):[Context](#context)

加入指定聊天室。`roomid`为要加入的聊天室ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#leaveFriend(userid:string,callback:(error)=>void):[Context](#context)

解除好友关系。`userid`为被解除好友的用户ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#leaveGroup(groupid:string,callback:(error)=>void):[Context](#context)

离开指定群组。`groupid`为要离开的群组ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#leaveRoom(roomid:string,callback:(error)=>void):[Context](#context)

离开指定聊天室。`roomid`为要离开的聊天室ID。 回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#setMyAttributes(attributes:object,overwrite:boolean,callback:(error)=>void):[Context](#context)

设置我的自定义属性。参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | attributes | object | 自定义属性表 |
| 2 | overwrite | boolean | 是否完全覆盖写入, 可选项, 默认为false |
| 3 | callback | function | 回调方法 |

回调方法`callback`的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#setMyAttribute(name:string,value:object,callback:(error)=>void):[Context](#context)

设置我的单个自定义属性。参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | name | string | 属性名 |
| 2 | value | object | 属性值, 建议使用基本类型 |
| 3 | callback | function | 回调方法 |

回调方法`callback`的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |

#### Context#getMyAttributes(callback:(error,attributes)=>void):[Context](#context)

获取我的自定义属性表。其中回调方法的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |
| 2 | attributes | object | 属性表 |

#### Context#getMyAttribute(name:string,callback:(error,attribute)=>void):[Context](#context)

获取我的单个自定义属性。参数`name`为属性名, 回调方法`callback`的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当操作发生异常时非空。 |
| 2 | attribute | object | 属性值 |

#### Context#search(query:object,skip:number,limit:number,sort:string[]):[SearchBuilder](#searchbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Context#load(id:string):[LoadBuilder])(#loadbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Context#getAttributes(id:string,atttibuteName:string):[GetAttributesBuilder](#getattributesbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Context#attachment(attachment:File|Blob):[AttachmentBuilder](#attachmentbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。


### TalkingBuilder
-----------------------------------------------

> 聊天记录查询构造器。

#### TalkingBuilder#ofFriend(friendid:string,callback:(error,records)=>void):[Context](#context)

查询与指定好友的聊天记录, 并返回起始用户上下文。其中参数`friendid`指定好友的用户ID, 回调方法`callback`的参数定义如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | records | [ChatRecord](#chatrecord)[] | 聊天记录数组 |

#### TalkingBuilder#ofGroup(groupid:string,callback:(error,records)=>void):[Context](#context)

查询与群组聊天记录, 并返回起始用户上下文。其中参数`groupid`指定群组ID, 回调方法`callback`的参数定义如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | records | [ChatRecord](#chatrecord)[] | 聊天记录数组 |

#### TalkingBuilder#ofStranger(strangerid:string,callback:(error,records)=>void):[Context](#context)

查询与指定陌生人的聊天记录, 并返回起始用户上下文。其中参数`strangerid`指定陌生人的用户ID, 回调方法`callback`的参数定义如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | records | [ChatRecord](#chatrecord)[] | 聊天记录数组 |

#### TalkingBuilder#ofPassenger(passengerid:string,callback:(error,records)=>void):[Context](#context)

查询与指定访客的聊天记录, 并返回起始用户上下文。其中参数`passengerid`为访客ID, 回调方法`callback`的参数定义如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | records | [ChatRecord](#chatrecord)[] | 聊天记录数组 |


### PassengerBuilder
--------------------------------------------

> 访客构造器。

#### PassengerBuilder#attribute(name:string,value:object):[PassengerBuilder](#passengerbuilder)

设置访客属性。

#### PassengerBuilder#onUserMessage(callback:(userid,message)=>void):[PassengerBuilder](#passengerbuilder)

绑定来自某个用户发送给您的消息。回调函数参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | userid | string | 用户ID |
| 2 | message | [BasicMessage](#basicmessage) | 消息体 |

#### PassengerBuilder#onSystemMessage(callback:(message)=>void):[PassengerBuilder](#passengerbuilder)

绑定来自管理员发送给您的系统消息。回调函数参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | message | [BasicMessage](#basicmessage) | 消息体 |

#### PassengerBuilder#onStrangerOnline(callback:(strangerid)=>void):[PassengerBuilder](#passengerbuilder)

绑定来自陌生人上线通知。回调函数参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | strangerid | string | 上线的陌生人用户ID |


#### PassengerBuilder#onStrangerOffline(callback:(strangerid)=>void):[PassengerBuilder](#passengerbuilder)

绑定来自陌生人下线通知。回调函数参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | strangerid | string | 下线的陌生人用户ID |

#### PassengerBuilder#ok(callback:(error,session,context)=>void)

结束链式调用提交并登录。回调函数参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常对象, 仅当session创建失败时非空 |
| 2 | session | [PassengerSession](#passengersession) | 访客登录会话 |
| 3 | context | [PassengerContext](#passengercontext) | 访客上下文 |

### PassengerSession
--------------------------------------------------

> 访客登录会话。维持一次访客登录连接。提供核心的消息收发功能。

#### PassengerSession#say(text:string,remark:string):[MessageBuilder](#messagebuilder)

返回一个消息构建器实例。

#### PassengerSession#close(callback:(error)=>void)

退出并关闭访客会话。

### PassengerContext
---------------------------------------------------

> 访客用户上下文。封装了针对当前登录访客的常用操作。

#### PassengerContext#current():string

返回当前登录的访客ID。

#### PassengerContext#search(query:object,skip:number,limit:number,sort:string[]):[SearchBuilder](#searchbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### PassengerContext#load(id:string):[LoadBuilder])(#loadbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### PassengerContext#getAttributes(id:string,atttibuteName:string):[GetAttributesBuilder](#getattributesbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### PassengerContext#attachment(attachment:File|Blob):[AttachmentBuilder](#attachmentbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。


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

#### Admin#search(query:object,skip:number,limit:number,sort:string[]):[SearchBuilder](#searchbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Admin#load(id:string):[LoadBuilder])(#loadbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Admin#getAttributes(id:string,atttibuteName:string):[GetAttributesBuilder](#getattributesbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

#### Admin#attachment(attachment:File|Blob):[AttachmentBuilder](#attachmentbuilder)

本方法继承自父类, 参见[Common](#common)中对应的方法。

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


### Common
----------------------------------------------

> 通用操作抽象类, 仅作为[Context](#context)和[Admin](#admin)的父类。用于封装最基础的只读业务操作。

#### Common#search(query:object,skip:number,limit:number:sort:string[]):[SearchBuilder](#searchbuilder)

创建一个搜索器实例。搜索器可以被用来返回搜索结果。参数定义如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | query | object | 查询条件, 可选项, 如: `{age:20,gender:'male'}` |
| 2 | skip | number | 跳过记录数, 可选项 |
| 3 | limit | number | 返回记录条数, 可选项, 默认20 |
| 4 | sort | string[] | 排序字段名列表, 可选项, 默认正序, 倒序请添加`-`前缀。如: ['age','-score'] |

#### Common#load(id:string):[LoadBuilder](#loadbuilder)

创建一个载入器实例。载入器可以被用于载入特定对象。参数`id`表示被载入对象的标识ID。

#### Common#getAttributes(id:string,attributeName:string):[GetAttributesBuilder](#getattributesbuilder)

返回一个属性查询器。属性查询器可以被用来返回属性对象。参数用法如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | id | string | 对象ID |
| 2 | attributeName | string | 指定属性名, 可选项, 如果指定则仅返回对应属性值 |

#### Common#attachment(attachment:File|Blob):[AttachmentBuilder](#attachmentbuilder)

创建并返回一个附件上传器。`attachment`可以是一个文件或者二进制块对象。

### GetAttributesBuilder
----------------------------------------------

> 属性查询器。

### GetAttributesBuilder#forUser(callback:(error,result)=>void)

返回用户的自定义属性。回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | result | object | 属性查询结果 |

### GetAttributesBuilder#forGroup(callback:(error,result)=>void)

返回群组的自定义属性。回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | result | object | 属性查询结果 |

### GetAttributesBuilder#forRoom(callback:(error,result)=>void)

返回聊天室的自定义属性。回调方法参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空 |
| 2 | result | object | 属性查询结果 |

### AttachmentBuilder
------------------------------------------------

> 附件上传器。当调用ok方法时会进行上传操作。

#### AttachmentBuilder#ok(callback:(error,uris)=>void)

提交执行上传。回调方法的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|-----|-----|-----|-----|
| 1 | error | [ParrotError](#parroterror) | 异常错误, 仅当查询操作发生异常时非空。 |
| 2 | uris | string[] | 上传后附件URI列表, 当您上传的附件为可裁剪的图片时, 系统将会返回2个URI, 其中第一个为原始图片地址, 第二个为缩略图地址。 |

### LoadBuilder
-------------------------------------------------

> 对象载入器。

#### LoadBuilder#forUser(callback:(error,user)=>void)

载入指定用户。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | user | [UserDetail](#userdetail) | 用户详情 |

#### LoadBuilder#forGroup(callback:(error,group)=>void)

载入指定群组。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | group | [Group](#group) | 群组详情 |

#### LoadBuilder#forRoom(callback:(error,room)=>void)

载入指定聊天室。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | room | [Room](#room) | 聊天室详情 |

#### LoadBuilder#forPassenger(callback:(error,passenger)=>void)

载入指定访客。回调函数的参数说明如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | passenger | [Passenger](#passenger) | 访客详情 |

### SearchBuilder
----------------------------------------------

> 搜索器

#### SearchBuilder#forUsers(callback:(error,users)=>void)

搜索用户。回调函数参数如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | users | [User](#user)[] | 用户列表 |

#### SearchBuilder#forGroups(callback:(error,groups)=>void)

搜索群组。回调函数参数如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | groups | [Group](#group)[] | 群组列表 |

#### SearchBuilder#forRooms(callback:(error,rooms)=>void)

搜索聊天室。回调函数参数如下:

| # | 参数名 | 类型 | 说明 |
|----|----|----|----|
| 1 | error | [ParrotError](#parroterror) | 错误异常, 仅当查询操作失败时非空 |
| 2 | rooms | [Room](#room)[] | 聊天室列表 |


### BasicMessage
---------------------------

> 基础消息结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| content | [Content](#content) | 消息正文 |
| ts | number | 消息送达时间戳 |
| remark | string | 消息备注(可选项) |

### Content
------------------------------

> 消息正文结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| media | number | 媒体类型: 0=纯文本, 1=图片, 2=音频, 3=视频 |
| body | string | 正文文本 |

### ParrotError
------------------------------

> 错误异常通用类, 继承自Error对象。

| 属性名 | 类型 | 说明 |
|------|------|------|
| errorCode | number | 错误码 |
| errorMessage | string | 错误消息 |

### Friend
------------------------------

> 好友详情结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| id | string | 好友的用户ID |
| online | boolean | 当前是否在线 |
| recent | [ChatRecord](#chatrecord) | 最近一条聊天记录, 可选项 |

### ChatRecord
-------------------------------------

> 通用聊天记录结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| speaker | string | 发言人的用户ID |
| content | [Content](#content) | 聊天消息记录正文 |
| remark | string | 消息备注, 可选项 |
| ts | number | 消息发送时间戳 |

### Group
-----------------------------------

> 群组详情结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| id | string | 群组ID |
| owner | string | 群组管理员 |
| members | string[] | 群组成员的用户ID列表  |
| attributes | object | 群组自定义属性 |
| ts | number | 群组创建时间 |
| recent | [ChatRecord](#chatrecord) | 最近一条群组聊天记录, 可选项 |

### Room
--------------------------------------

> 聊天室详情结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| id | string | 聊天室ID |
| members | string[] | 聊天室成员的用户ID列表  |
| attributes | object | 聊天室自定义属性 |
| ts | number | 聊天室创建时间 |


### User
--------------------------------------

> 用户信息结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| id | string | 用户ID |
| online | boolean | 是否在线 |
| attributes | object | 用户属性表 |
| ts | number | 用户创建时间戳 |

### Stranger
-----------------------------------------

> 陌生人信息结构体。属性说明如下:

| 属性名 | 类型 | 说明 |
|------|------|------|
| id | string | 陌生人的用户ID |
| online | boolean | 当前是否在线 |
| recent | [ChatRecord](#chatrecord) | 最近一条聊天记录, 可选项 |


### YourselfMessage
------------------------------------

> 来自你本人的消息结构体。属性说明如下:

// 施工中
