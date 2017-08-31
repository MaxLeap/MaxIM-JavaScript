"use strict";
var io = require("socket.io-client");
var utils_1 = require("../../helper/utils");
var messages_1 = require("../../model/messages");
var context_1 = require("../context/context");
var session_1 = require("./session");
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
        this.acks = [];
    }
    SessionBuilderImpl.prototype.setNotifyAll = function (enable) {
        this.authdata.notifyAll = enable;
        return this;
    };
    SessionBuilderImpl.prototype.setInstallation = function (installation) {
        this.authdata.install = installation;
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
    SessionBuilderImpl.prototype.onAck = function (handler) {
        this.acks.push(handler);
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
            transports: ["websocket"],
        });
        socket.once("login", function (result) {
            var foo = result;
            if (foo.success) {
                var session = new session_1.SessionImpl(socket, foo.id);
                var ctx = new context_1.ContextImpl(_this.apiOptions, result.id);
                callback(null, session, ctx);
            }
            else {
                callback(new Error("error: " + foo.error), null, null);
            }
        });
        socket.on("message", function (income) {
            var msg = income;
            var basicmsg = utils_1.convert2basic(msg);
            switch (msg.from.type) {
                case messages_1.Receiver.ACTOR:
                    for (var _i = 0, _a = _this.friends; _i < _a.length; _i++) {
                        var it = _a[_i];
                        it(msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.GROUP:
                    for (var _b = 0, _c = _this.groups; _b < _c.length; _b++) {
                        var it = _c[_b];
                        it(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.ROOM:
                    for (var _d = 0, _e = _this.rooms; _d < _e.length; _d++) {
                        var it = _e[_d];
                        it(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.PASSENGER:
                    for (var _f = 0, _g = _this.passengers; _f < _g.length; _f++) {
                        var it = _g[_f];
                        it(msg.from.id, basicmsg);
                    }
                    break;
                case messages_1.Receiver.STRANGER:
                    for (var _h = 0, _j = _this.strangers; _h < _j.length; _h++) {
                        var it = _j[_h];
                        it(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });
        socket.on("online", function (onlineid) {
            for (var _i = 0, _a = _this.friendonlines; _i < _a.length; _i++) {
                var it = _a[_i];
                it(onlineid);
            }
        });
        socket.on("offline", function (offlineid) {
            for (var _i = 0, _a = _this.friendofflines; _i < _a.length; _i++) {
                var it = _a[_i];
                it(offlineid);
            }
        });
        socket.on("online_x", function (onlineid) {
            for (var _i = 0, _a = _this.strangeronlineds; _i < _a.length; _i++) {
                var it = _a[_i];
                it(onlineid);
            }
        });
        socket.on("offline_x", function (offlineid) {
            for (var _i = 0, _a = _this.strangerofflines; _i < _a.length; _i++) {
                var it = _a[_i];
                it(offlineid);
            }
        });
        socket.on("sys", function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.systems; _i < _a.length; _i++) {
                var it = _a[_i];
                it(msg);
            }
        });
        socket.on("yourself", function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.yourselfs; _i < _a.length; _i++) {
                var it = _a[_i];
                it(msg);
            }
        });
        socket.on("ack", function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.acks; _i < _a.length; _i++) {
                var it = _a[_i];
                it(msg.ack, msg.ts);
            }
        });
    };
    return SessionBuilderImpl;
}());
exports.SessionBuilderImpl = SessionBuilderImpl;

//# sourceMappingURL=buildSession.js.map
