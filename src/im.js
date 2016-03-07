'use strict';

var _ = require('underscore');
var FormData = require('form-data');
var tool = require('./tool');
var ajax = tool.ajax;
var extend = tool.extend;
var io = require('socket.io-client');

// 当前版本
var VERSION = '0.1.0';

var CN_IM_REST_URL = 'http://im.maxleap.cn';
var US_IM_REST_URL = 'http://im.maxleap.com';
var CN_IM_SOCKET_URL = 'http://im.maxleap.cn/chat';
var US_IM_SOCKET_URL = 'http://im.maxleap.com/chat';

// 配置项
var config = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
};

// 命名空间，挂载私有方法
var engine = {};

var typeEnum = {
  friend: 0,
  group: 1,
  room: 2
};

var mediaEnum = {
  text: 0,
  image: 1,
  audio: 2,
  video: 3
};

var restAgent = function() {

  return {
    userInfo: function(cache, user, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    listFriends: function(cache, user, callback, withDetail) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/friends';
      if (withDetail) {
        opts.url = opts.url + '?detail';
      }
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    addFriend: function(cache, user, friend, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/friends/' + friend;
      opts.method = 'post';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    rmFriend: function(cache, user, friend, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/friends/' + friend;
      opts.method = 'delete';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    getFriendshipInfo: function(cache, user, friend, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/friends/' + friend;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    getRecentChat: function(cache, user, friend, ts, size, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/friends/' + friend + '/chats?ts=' + ts + '&limit=' + size;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    getGroupChat: function(cache, group, ts, size, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + group + '/chats?ts=' + ts + '&limit=' + size;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    listGroups: function(cache, user, callback, withDetail) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/groups';
      if (withDetail) {
        opts.url = opts.url + '?detail';
      }
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    listRooms: function(cache, user, callback, withDetail) {
      var opts = {};
      opts.url = cache.server.rest + '/ctx/' + user + '/rooms';
      if (withDetail) {
        opts.url = opts.url + '?detail';
      }
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    addGroup: function(cache, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    addRoom: function(cache, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    getGroup: function(cache, _id, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + _id;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    getRoom: function(cache, _id, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms/' + _id;
      opts.method = 'get';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    updateGroup: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + _id;
      opts.method = 'put';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    updateRoom: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms/' + _id;
      opts.method = 'put';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    rmGroup: function(cache, _id, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + _id;
      opts.method = 'delete';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    rmRoom: function(cache, _id, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms/' + _id;
      opts.method = 'delete';
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    },
    addGroupMembers: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + _id + '/members';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    addRoomMembers: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms/' + _id + '/members';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    rmGroupMembers: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/groups/' + _id + '/members';
      opts.method = 'delete';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    rmRoomMembers: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/rooms/' + _id + '/members';
      opts.method = 'delete';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    sysToAll: function(cache, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/system';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    sysToUser: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/system/' + _id;
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    sysToGroup: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/system/' + _id + '?group';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    sysToRoom: function(cache, _id, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/system/' + _id + '?room';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      opts.headers['Content-Type'] = 'application/json';
      ajax(opts, callback);
    },
    attachment: function(cache, data, callback) {
      var opts = {};
      opts.url = cache.server.rest + '/attachment';
      opts.method = 'post';
      opts.data = data;
      opts.headers = engine.genHeader(cache);
      ajax(opts, callback);
    }
  };
};

var socketAgent = function() {
  return {
    ws: undefined,
    connect: function(cache, config, callback) {
      var url = cache.server.socket;
      callback = callback || function() {console.log(cache.options.userId || cache.options.username + '  connected!.........');};
      var auth = {
        app: cache.options.appId,
        sign: cache.signature,
        client: cache.options.userId
      };
      if (cache.options.userId !== undefined) {
        auth.client = cache.options.userId;
      }else {
        auth.username = cache.options.username;
        auth.password = cache.options.password;
      }
      config.query = 'auth=' + JSON.stringify(auth);
      this.ws = io.connect(url, config);
      this.ws.on('connect', callback);
      this.ws.on('login', function(data) {
        if (data.success) {
          console.log(cache.options.username || cache.options.userId + ' login success!.......');
          cache.options.userId = data.id;
        }else {
          throw new Error(cache.options.username + ' Login Fail with errorcode: ' + data.errcode);
        }
      });
    },
    say: function(msg) {
      this.ws.emit('say', msg);
    },
    onMessage: function(callback) {
      this.ws.on('message', callback);
    },
    online: function(callback) {
      this.ws.on('online', callback);
    },
    offline: function(callback) {
      this.ws.on('offline', callback);
    },
    sys: function(callback) {
      this.ws.on('sys', callback);
    },
    yourself: function(callback) {
      this.ws.on('yourself', callback);
    }
  };
};

var newimObject = function() {
  var cache = {
    // 基础配置，包括 appId 等
    options: undefined,
    // SocketAgent 实例
    socketAgent: undefined,
    // RestAgent 实例
    restAgent: undefined,

    signature: undefined
  };
  return {
    cache: cache,
    req: {},
    open: function(callback) {
      var me = this;
      var cache = this.cache;
      engine.getServer(cache, cache.options);
      cache.socketAgent.connect(cache, config, callback);
    },
    toFriend: function(friend) {
      this.req = {};
      this.req.to = {
        id: friend,
        type: typeEnum.friend
      };
      return this;
    },
    toGroup: function(group) {
      this.req = {};
      this.req.to = {
        id: group,
        type: typeEnum.group
      };
      return this;
    },
    toRoom: function(room) {
      this.req = {};
      this.req.to = {
        id: room,
        type: typeEnum.room
      };
      return this;
    },
    text: function(data) {
      this.req.content = {
        media: mediaEnum.text,
        body: data
      };
      return this;
    },
    image: function(data) {
      this.req.content = {
        media: mediaEnum.image,
        body: data
      };
      return this;
    },
    audio: function(data) {
      this.req.content = {
        media: mediaEnum.audio,
        body: data
      };
      return this;
    },
    video: function(data) {
      this.req.content = {
        media: mediaEnum.video,
        body: data
      };
      return this;
    },
    ok: function() {
      var me = this;
      var filedata;
      this.req.ts = tool.now();
      var cache = this.cache;
      if (this.req.content.media != mediaEnum.text) {
        var data = this.req.content.body;
        if (tool.isFile(data)) {
          filedata = new FormData();
          filedata.append('userfile', data);
        }

        if (tool.isFormData(data)) {
          filedata = data;
        }
        this.attachment(filedata, function(err, msg) {
          me.req.content.body = msg;
          cache.socketAgent.say(JSON.stringify(me.req));
        });
      }else {
        cache.socketAgent.say(JSON.stringify(this.req));
      }

    },
    chunk: function() {
      var me = this;
      _.each(_.functions(cache.restAgent), function(name) {
        if (name != 'genHeader') {
          me[name] = _.partial(me.cache.restAgent[name], me.cache);
        }
      });
      _.each(['onMessage','online','offline','sys','yourself'], function(name) {
        me[name] = function() {return me.cache.socketAgent[name].apply(me.cache.socketAgent,arguments);};
      });
      return me;
    }

  };
};

// 主函数，启动通信并获得 imObject
var im = function(options, callback) {
  if (typeof options !== 'object') {
    throw new Error('realtime need a argument at least.');
  } else if (!options.appId) {
    throw new Error('Options must have appId.');
  } else {
    options = {
      // Maxleap 中唯一的App id
      appId: options.appId,
      // clientId 对应的就是 ClientKey，如果不传入服务器会自动生成，客户端没有持久化该数据。
      clientId: options.clientId,
      // userId
      userId: options.userId,
      //installId
      installId: options.installId,
      //username
      username: options.username,
      //password
      password: options.password,
      // 服务器地区选项，默认为中国大陆
      region: options.region || 'cn'
    };

    var imObj = newimObject();
    imObj.cache.options = options;
    imObj.cache.signature = tool.createSignature(options);
    imObj.cache.socketAgent = socketAgent();
    imObj.cache.restAgent = restAgent();
    imObj.open(callback);
    imObj.chunk();
    return imObj;
  }
};

// 赋值版本号
im.version = VERSION;

// 挂载私有方法
im._tool = tool;
im._engine = engine;

engine.getServer = function(cache, options) {
  cache.server = {};
  switch (options.region) {
    case 'cn':
      cache.server.socket = CN_IM_SOCKET_URL;
      cache.server.rest = CN_IM_REST_URL;
      break;
    case 'us':
      cache.server.socket = US_IM_SOCKET_URL;
      cache.server.rest = US_IM_REST_URL;
      break;
    default:
      throw new Error('There is no this region.');
  }
};

engine.genHeader = function(cache) {
  return {
    'X-ML-AppId': cache.options.appId,
    'X-ML-Request-Sign': cache.signature
  };
};

if (typeof exports !== 'undefined') {
  // CommonJS 支持
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = im;
  }
  exports.im = im;
  /* jshint -W117 */
  /* ignore 'define' is not defined */
} else if (typeof define === 'function' && define.amd) {
  // AMD 支持
  define('im', [], function() {
    return im;
  });
  /* jshint +W117 */
}
