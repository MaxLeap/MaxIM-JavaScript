"use strict";
var messages_1 = require("../model/messages");
var context_1 = require("./context");
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
    MessageBuilderImpl.prototype.toFriend = function (friend) {
        this.message.to.id = friend;
        this.message.to.type = messages_1.Receiver.ACTOR;
        return new MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toGroup = function (groupid) {
        this.message.to.id = groupid;
        this.message.to.type = messages_1.Receiver.GROUP;
        return new MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toRoom = function (roomid) {
        this.message.to.id = roomid;
        this.message.to.type = messages_1.Receiver.ROOM;
        return new MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toPassenger = function (passengerid) {
        this.message.to.id = passengerid;
        this.message.to.type = messages_1.Receiver.PASSENGER;
        return new MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toStranger = function (strangerid) {
        this.message.to.id = strangerid;
        this.message.to.type = messages_1.Receiver.STRANGER;
        return new MessageLauncherImpl(this.session, this.message);
    };
    return MessageBuilderImpl;
}());
var MessageLauncherImpl = (function () {
    function MessageLauncherImpl(session, message) {
        this.session = session;
        this.message = message;
    }
    MessageLauncherImpl.prototype.ok = function (callback) {
        try {
            this.session.socket.emit('say', this.message);
            if (callback) {
                callback(null, null);
            }
        }
        catch (e) {
            if (callback) {
                callback(e);
            }
        }
        return this.session;
    };
    return MessageLauncherImpl;
}());
var SessionBuilderImpl = (function () {
    function SessionBuilderImpl(apiOptions, authdata) {
        this.apiOptions = apiOptions;
        this.authdata = authdata;
        this.friends = [];
        this.groups = [];
        this.rooms = [];
        this.passengers = [];
        this.strangers = [];
        this.friendonlines = [];
        this.friendofflines = [];
        this.strangeronlineds = [];
        this.strangerofflines = [];
        this.systems = [];
        this.yourselfs = [];
    }
    SessionBuilderImpl.prototype.setNotifyAll = function (enable) {
        this.authdata['notifyAll'] = enable;
        return this;
    };
    SessionBuilderImpl.prototype.setInstallation = function (installation) {
        this.authdata['install'] = installation;
        return this;
    };
    SessionBuilderImpl.prototype.onFriendMessage = function (handler) {
        this.friends.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onGroupMessage = function (handler) {
        this.groups.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onRoomMessage = function (handler) {
        this.rooms.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onPassengerMessage = function (handler) {
        this.passengers.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onStrangerMessage = function (handler) {
        this.strangers.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onFriendOnline = function (handler) {
        this.friendonlines.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onFriendOffline = function (handler) {
        this.friendofflines.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onStrangerOnline = function (handler) {
        this.strangeronlineds.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onStrangerOffline = function (handler) {
        this.strangerofflines.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onSystemMessage = function (handler) {
        this.systems.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.onYourself = function (handler) {
        this.yourselfs.push(handler);
        return this;
    };
    SessionBuilderImpl.prototype.ok = function (callback) {
        var _this = this;
        var url = this.apiOptions.server + "/chat";
        var socket = io.connect(url, {
            query: "auth=" + JSON.stringify(this.authdata),
            transports: ['websocket']
        });
        socket.once('login', function (result) {
            var foo = result;
            if (foo.success) {
                var session = new SessionImpl(socket, foo.id);
                var ctx = new context_1.ContextImpl(_this.apiOptions, result.id);
                callback(null, session, ctx);
            }
            else {
                callback(new Error("error: " + foo.error), null, null);
            }
        });
        socket.on('message', function (income) {
            var msg = income;
            var basicmsg = utils_1.convert2basic(msg);
            switch (msg.from.type) {
                case messages_1.Receiver.ACTOR:
                    for (var _i = 0, _a = _this.friends; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.GROUP:
                    for (var _b = 0, _c = _this.groups; _b < _c.length; _b++) {
                        var handler = _c[_b];
                        handler(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.ROOM:
                    for (var _d = 0, _e = _this.rooms; _d < _e.length; _d++) {
                        var handler = _e[_d];
                        handler(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.PASSENGER:
                    for (var _f = 0, _g = _this.passengers; _f < _g.length; _f++) {
                        var handler = _g[_f];
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.STRANGER:
                    for (var _h = 0, _j = _this.strangers; _h < _j.length; _h++) {
                        var handler = _j[_h];
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });
        socket.on('online', function (onlineid) {
            for (var _i = 0, _a = _this.friendonlines; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(onlineid);
            }
        });
        socket.on('offline', function (offlineid) {
            for (var _i = 0, _a = _this.friendofflines; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(offlineid);
            }
        });
        socket.on('online_x', function (onlineid) {
            for (var _i = 0, _a = _this.strangeronlineds; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(onlineid);
            }
        });
        socket.on('offline_x', function (offlineid) {
            for (var _i = 0, _a = _this.strangerofflines; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(offlineid);
            }
        });
        socket.on('sys', function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.systems; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(msg);
            }
        });
        socket.on('yourself', function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.yourselfs; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(msg);
            }
        });
    };
    return SessionBuilderImpl;
}());
exports.SessionBuilderImpl = SessionBuilderImpl;
var SessionImpl = (function () {
    function SessionImpl(socket, userid) {
        this.closed = false;
        this.socket = socket;
        this.userid = userid;
    }
    SessionImpl.prototype.current = function () {
        return this.userid;
    };
    SessionImpl.prototype.say = function (text, remark) {
        if (this.closed) {
            throw new Error('session is closed.');
        }
        return new MessageBuilderImpl(this, text, remark);
    };
    SessionImpl.prototype.close = function (callback) {
        if (this.closed) {
            return;
        }
        this.closed = true;
        this.socket.close();
    };
    return SessionImpl;
}());

//# sourceMappingURL=session.js.map
