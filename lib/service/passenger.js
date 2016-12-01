"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var messages_1 = require("../model/messages");
var md5_1 = require("../helper/md5");
var common_1 = require("./common");
var utils_1 = require("../helper/utils");
var io = require('socket.io-client');
var MessageBuilderImpl = (function () {
    function MessageBuilderImpl(session, text, remark) {
        this.session = session;
        this.message = {
            to: {
                id: null
            },
            content: {
                media: messages_1.Media.TEXT,
                body: text
            }
        };
        if (remark != null) {
            this.message.remark = remark;
        }
    }
    MessageBuilderImpl.prototype.createPushIfNotExist = function () {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    };
    MessageBuilderImpl.prototype.disablePush = function () {
        this.createPushIfNotExist().enable = false;
        return this;
    };
    MessageBuilderImpl.prototype.setPushSound = function (sound) {
        this.createPushIfNotExist().sound = sound;
        return this;
    };
    MessageBuilderImpl.prototype.setPushBadge = function (badge) {
        this.createPushIfNotExist().badge = badge;
        return this;
    };
    MessageBuilderImpl.prototype.setPushContentAvailable = function (contentAvailable) {
        this.createPushIfNotExist().contentAvailable = contentAvailable;
        return this;
    };
    MessageBuilderImpl.prototype.setPushPrefix = function (prefix) {
        this.createPushIfNotExist().prefix = prefix;
        return this;
    };
    MessageBuilderImpl.prototype.setPushSuffix = function (suffix) {
        this.createPushIfNotExist().suffix = suffix;
        return this;
    };
    MessageBuilderImpl.prototype.setPushTextOverwrite = function (text) {
        this.createPushIfNotExist().overwrite = text;
        return this;
    };
    MessageBuilderImpl.prototype.asText = function () {
        this.message.content.media = messages_1.Media.TEXT;
        return this;
    };
    MessageBuilderImpl.prototype.asImage = function () {
        this.message.content.media = messages_1.Media.IMAGE;
        return this;
    };
    MessageBuilderImpl.prototype.asAudio = function () {
        this.message.content.media = messages_1.Media.AUDIO;
        return this;
    };
    MessageBuilderImpl.prototype.asVideo = function () {
        this.message.content.media = messages_1.Media.VIDEO;
        return this;
    };
    MessageBuilderImpl.prototype.toUser = function (userid) {
        this.message.to.id = userid;
        return new MessageLauncherImpl(this.session, this.message);
    };
    return MessageBuilderImpl;
}());
var MessageLauncherImpl = (function () {
    function MessageLauncherImpl(session, message) {
        this._session = session;
        this._message = message;
    }
    MessageLauncherImpl.prototype.ok = function (callback) {
        try {
            this._session._socket.emit('say', this._message);
            if (callback) {
                callback(null, null);
            }
        }
        catch (e) {
            if (callback) {
                callback(e);
            }
        }
        return this._session;
    };
    return MessageLauncherImpl;
}());
var PassengerSessionImpl = (function () {
    function PassengerSessionImpl(socket, passengerid) {
        this._socket = socket;
        this._id = passengerid;
    }
    PassengerSessionImpl.prototype.say = function (text, remark) {
        return new MessageBuilderImpl(this, text, remark);
    };
    PassengerSessionImpl.prototype.close = function (callback) {
        if (this._closed) {
            return;
        }
        this._closed = true;
        this._socket.close();
    };
    return PassengerSessionImpl;
}());
var PassengerContextImpl = (function (_super) {
    __extends(PassengerContextImpl, _super);
    function PassengerContextImpl(options, you) {
        _super.call(this, options);
        this._you = you;
    }
    PassengerContextImpl.prototype.current = function () {
        return this._you;
    };
    return PassengerContextImpl;
}(common_1.CommonServiceImpl));
var PassengerBuilderImpl = (function () {
    function PassengerBuilderImpl(options, id) {
        this._attributes = [];
        this._fromuser = [];
        this._fromsystem = [];
        this._fromStrangerOnline = [];
        this._fromStrangerOffline = [];
        this._options = options;
        this._id = id;
    }
    PassengerBuilderImpl.prototype.attribute = function (name, value) {
        this._attributes[name] = value;
        return this;
    };
    PassengerBuilderImpl.prototype.onUserMessage = function (callback) {
        this._fromuser.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onSystemMessage = function (callback) {
        this._fromsystem.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onStrangerOnline = function (callback) {
        this._fromStrangerOnline.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onStrangerOffline = function (callback) {
        this._fromStrangerOffline.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.ok = function (callback) {
        var _this = this;
        var url = this._options.server + "/chat";
        var foo = new Date().getTime();
        var bar = md5_1.md5("" + foo + this._options.sign) + ',' + foo;
        var authdata = {
            app: this._options.app,
            sign: bar,
            passenger: {}
        };
        for (var k in this._attributes) {
            if (k === 'id') {
                continue;
            }
            authdata.passenger[k] = this._attributes[k];
        }
        if (this._id) {
            authdata.passenger['id'] = this._id;
        }
        var socket = io.connect(url, {
            query: "auth=" + JSON.stringify(authdata),
            transports: ['websocket']
        });
        socket.once('login', function (result) {
            var foo = result;
            if (foo.success) {
                var session = new PassengerSessionImpl(socket, foo.id);
                var ctx = new PassengerContextImpl(_this._options, foo.id);
                callback(null, session, ctx);
            }
            else {
                var err = new utils_1.ParrotError({ errorCode: foo.error, errorMessage: '' });
                callback(err);
            }
        });
        socket.on('message', function (income) {
            var msg = income;
            var basicmsg = utils_1.convert2basic(msg);
            switch (msg.from.type) {
                case messages_1.Receiver.ACTOR:
                    for (var _i = 0, _a = _this._fromuser; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });
        socket.on('online_x', function (onlineid) {
            for (var _i = 0, _a = _this._fromStrangerOnline; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(onlineid);
            }
        });
        socket.on('offline_x', function (offlineid) {
            for (var _i = 0, _a = _this._fromStrangerOffline; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(offlineid);
            }
        });
        socket.on('sys', function (income) {
            var msg = income;
            for (var _i = 0, _a = _this._fromsystem; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(msg);
            }
        });
    };
    return PassengerBuilderImpl;
}());
exports.PassengerBuilderImpl = PassengerBuilderImpl;

//# sourceMappingURL=passenger.js.map
