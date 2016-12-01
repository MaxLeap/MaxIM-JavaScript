(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../model/messages", "./context", "../helper/utils", 'socket.io-client'], factory);
    }
})(function (require, exports) {
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
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2aWNlL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBQUEseUJBU08sbUJBQW1CLENBQUMsQ0FBQTtJQUMzQix3QkFBbUMsV0FBVyxDQUFDLENBQUE7SUFFL0Msc0JBQTRCLGlCQUFpQixDQUFDLENBQUE7SUFDOUMsSUFBTyxFQUFFLFdBQVcsa0JBQWtCLENBQUMsQ0FBQztJQTRCeEM7UUFLSSw0QkFBWSxPQUFvQixFQUFFLElBQVksRUFBRSxNQUFlO1lBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ1gsRUFBRSxFQUFFO29CQUNBLEVBQUUsRUFBRSxJQUFJO2lCQUNYO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxJQUFJO29CQUNqQixJQUFJLEVBQUUsSUFBSTtpQkFDYjthQUNKLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLENBQUM7UUFDTCxDQUFDO1FBRUQsbUNBQU0sR0FBTjtZQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxnQkFBSyxDQUFDLElBQUksQ0FBQztZQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxvQ0FBTyxHQUFQO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGdCQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELG9DQUFPLEdBQVA7WUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsZ0JBQUssQ0FBQyxLQUFLLENBQUM7WUFDekMsTUFBTSxDQUFDLElB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QUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFFTCxrQkFBQztJQUFELENBL0JBLEFBK0JDLElBQUEiLCJmaWxlIjoic2VydmljZS9zZXNzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBNZWRpYSxcbiAgICBNZXNzYWdlVG8sXG4gICAgUHVzaFNldHRpbmdzLFxuICAgIFJlY2VpdmVyLFxuICAgIE1lc3NhZ2VGcm9tLFxuICAgIFlvdXJzZWxmTWVzc2FnZUZyb20sXG4gICAgU3lzdGVtTWVzc2FnZUZyb20sXG4gICAgQmFzaWNNZXNzYWdlRnJvbVxufSBmcm9tIFwiLi4vbW9kZWwvbWVzc2FnZXNcIjtcbmltcG9ydCB7Q29udGV4dCwgQ29udGV4dEltcGx9IGZyb20gXCIuL2NvbnRleHRcIjtcbmltcG9ydCB7QVBJT3B0aW9ucywgSGFuZGxlcjIsIEhhbmRsZXIzLCBIYW5kbGVyMSwgQ2FsbGJhY2ssIENhbGxiYWNrMiwgTG9naW5SZXN1bHR9IGZyb20gXCIuLi9tb2RlbC9tb2RlbHNcIjtcbmltcG9ydCB7Y29udmVydDJiYXNpY30gZnJvbSBcIi4uL2hlbHBlci91dGlsc1wiO1xuaW1wb3J0IGlvID0gcmVxdWlyZSgnc29ja2V0LmlvLWNsaWVudCcpO1xuaW1wb3J0IFNvY2tldCA9IFNvY2tldElPQ2xpZW50LlNvY2tldDtcblxuaW50ZXJmYWNlIE1lc3NhZ2VCdWlsZGVyIHtcbiAgICBhc1RleHQoKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgYXNJbWFnZSgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBhc0F1ZGlvKCk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIGFzVmlkZW8oKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICBkaXNhYmxlUHVzaCgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU291bmQoc291bmQ6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hCYWRnZShiYWRnZTogbnVtYmVyKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hQcmVmaXgocHJlZml4OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU3VmZml4KHN1ZmZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaFRleHRPdmVyd3JpdGUodGV4dDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICB0b0ZyaWVuZChmcmllbmQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlcjtcbiAgICB0b0dyb3VwKGdyb3VwaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlcjtcbiAgICB0b1Jvb20ocm9vbWlkOiBzdHJpbmcpOiBNZXNzYWdlTGF1bmNoZXI7XG4gICAgdG9QYXNzZW5nZXIocGFzc2VuZ2VyaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlcjtcbiAgICB0b1N0cmFuZ2VyKHN0cmFuZ2VyaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlcjtcbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgb2soY2FsbGJhY2s/OiBDYWxsYmFjazx2b2lkPik6IFNlc3Npb247XG59XG5cbmNsYXNzIE1lc3NhZ2VCdWlsZGVySW1wbCBpbXBsZW1lbnRzIE1lc3NhZ2VCdWlsZGVyIHtcblxuICAgIG1lc3NhZ2U6IE1lc3NhZ2VUbztcbiAgICBzZXNzaW9uOiBTZXNzaW9uSW1wbDtcblxuICAgIGNvbnN0cnVjdG9yKHNlc3Npb246IFNlc3Npb25JbXBsLCB0ZXh0OiBzdHJpbmcsIHJlbWFyaz86IHN0cmluZykge1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSB7XG4gICAgICAgICAgICB0bzoge1xuICAgICAgICAgICAgICAgIGlkOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgICAgIG1lZGlhOiBNZWRpYS5URVhULFxuICAgICAgICAgICAgICAgIGJvZHk6IHRleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlbWFyayAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UucmVtYXJrID0gcmVtYXJrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNUZXh0KCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQubWVkaWEgPSBNZWRpYS5URVhUO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc0ltYWdlKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQubWVkaWEgPSBNZWRpYS5JTUFHRTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXNBdWRpbygpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS5jb250ZW50Lm1lZGlhID0gTWVkaWEuQVVESU87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFzVmlkZW8oKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLm1lc3NhZ2UuY29udGVudC5tZWRpYSA9IE1lZGlhLlZJREVPO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVB1c2hJZk5vdEV4aXN0KCk6IFB1c2hTZXR0aW5ncyB7XG4gICAgICAgIGlmICghdGhpcy5tZXNzYWdlLnB1c2gpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5wdXNoID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZS5wdXNoO1xuICAgIH1cblxuICAgIGRpc2FibGVQdXNoKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLmVuYWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoU291bmQoc291bmQ6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLnNvdW5kID0gc291bmQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldFB1c2hCYWRnZShiYWRnZTogbnVtYmVyKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkuYmFkZ2UgPSBiYWRnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLmNvbnRlbnRBdmFpbGFibGUgPSBjb250ZW50QXZhaWxhYmxlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoUHJlZml4KHByZWZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkucHJlZml4ID0gcHJlZml4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoU3VmZml4KHN1ZmZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkuc3VmZml4ID0gc3VmZml4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoVGV4dE92ZXJ3cml0ZSh0ZXh0OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHVzaElmTm90RXhpc3QoKS5vdmVyd3JpdGUgPSB0ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0b0ZyaWVuZChmcmllbmQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by5pZCA9IGZyaWVuZDtcbiAgICAgICAgdGhpcy5tZXNzYWdlLnRvLnR5cGUgPSBSZWNlaXZlci5BQ1RPUjtcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlTGF1bmNoZXJJbXBsKHRoaXMuc2Vzc2lvbiwgdGhpcy5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0b0dyb3VwKGdyb3VwaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by5pZCA9IGdyb3VwaWQ7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by50eXBlID0gUmVjZWl2ZXIuR1JPVVA7XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUxhdW5jaGVySW1wbCh0aGlzLnNlc3Npb24sIHRoaXMubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdG9Sb29tKHJvb21pZDogc3RyaW5nKTogTWVzc2FnZUxhdW5jaGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLnRvLmlkID0gcm9vbWlkO1xuICAgICAgICB0aGlzLm1lc3NhZ2UudG8udHlwZSA9IFJlY2VpdmVyLlJPT007XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUxhdW5jaGVySW1wbCh0aGlzLnNlc3Npb24sIHRoaXMubWVzc2FnZSk7XG4gICAgfVxuXG4gICAgdG9QYXNzZW5nZXIocGFzc2VuZ2VyaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by5pZCA9IHBhc3NlbmdlcmlkO1xuICAgICAgICB0aGlzLm1lc3NhZ2UudG8udHlwZSA9IFJlY2VpdmVyLlBBU1NFTkdFUjtcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlTGF1bmNoZXJJbXBsKHRoaXMuc2Vzc2lvbiwgdGhpcy5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICB0b1N0cmFuZ2VyKHN0cmFuZ2VyaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by5pZCA9IHN0cmFuZ2VyaWQ7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by50eXBlID0gUmVjZWl2ZXIuU1RSQU5HRVI7XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUxhdW5jaGVySW1wbCh0aGlzLnNlc3Npb24sIHRoaXMubWVzc2FnZSk7XG4gICAgfVxuXG59XG5cbmNsYXNzIE1lc3NhZ2VMYXVuY2hlckltcGwgaW1wbGVtZW50cyBNZXNzYWdlTGF1bmNoZXIge1xuXG4gICAgc2Vzc2lvbjogU2Vzc2lvbkltcGw7XG4gICAgbWVzc2FnZTogTWVzc2FnZVRvO1xuXG4gICAgY29uc3RydWN0b3Ioc2Vzc2lvbjogU2Vzc2lvbkltcGwsIG1lc3NhZ2U6IE1lc3NhZ2VUbykge1xuICAgICAgICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIH1cblxuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBTZXNzaW9uIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbi5zb2NrZXQuZW1pdCgnc2F5JywgdGhpcy5tZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXNzaW9uO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlc3Npb25CdWlsZGVySW1wbCBpbXBsZW1lbnRzIFNlc3Npb25CdWlsZGVyIHtcblxuICAgIHByaXZhdGUgZnJpZW5kczogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+W107XG4gICAgcHJpdmF0ZSBncm91cHM6IEhhbmRsZXIzPHN0cmluZyxzdHJpbmcsQmFzaWNNZXNzYWdlRnJvbT5bXTtcbiAgICBwcml2YXRlIHJvb21zOiBIYW5kbGVyMzxzdHJpbmcsc3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+W107XG4gICAgcHJpdmF0ZSBwYXNzZW5nZXJzOiBIYW5kbGVyMjxzdHJpbmcsQmFzaWNNZXNzYWdlRnJvbT5bXTtcbiAgICBwcml2YXRlIHN0cmFuZ2VyczogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+W107XG4gICAgcHJpdmF0ZSBmcmllbmRvbmxpbmVzOiBIYW5kbGVyMTxzdHJpbmc+W107XG4gICAgcHJpdmF0ZSBmcmllbmRvZmZsaW5lczogSGFuZGxlcjE8c3RyaW5nPltdO1xuICAgIHByaXZhdGUgc3RyYW5nZXJvbmxpbmVkczogSGFuZGxlcjE8c3RyaW5nPltdO1xuICAgIHByaXZhdGUgc3RyYW5nZXJvZmZsaW5lczogSGFuZGxlcjE8c3RyaW5nPltdO1xuICAgIHByaXZhdGUgc3lzdGVtczogSGFuZGxlcjE8U3lzdGVtTWVzc2FnZUZyb20+W107XG4gICAgcHJpdmF0ZSB5b3Vyc2VsZnM6IEhhbmRsZXIxPFlvdXJzZWxmTWVzc2FnZUZyb20+W107XG5cbiAgICBwcml2YXRlIGFwaU9wdGlvbnM6IEFQSU9wdGlvbnM7XG4gICAgcHJpdmF0ZSBhdXRoZGF0YToge307XG5cbiAgICBjb25zdHJ1Y3RvcihhcGlPcHRpb25zOiBBUElPcHRpb25zLCBhdXRoZGF0YToge30pIHtcbiAgICAgICAgdGhpcy5hcGlPcHRpb25zID0gYXBpT3B0aW9ucztcbiAgICAgICAgdGhpcy5hdXRoZGF0YSA9IGF1dGhkYXRhO1xuXG4gICAgICAgIHRoaXMuZnJpZW5kcyA9IFtdO1xuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xuICAgICAgICB0aGlzLnJvb21zID0gW107XG4gICAgICAgIHRoaXMucGFzc2VuZ2VycyA9IFtdO1xuICAgICAgICB0aGlzLnN0cmFuZ2VycyA9IFtdO1xuXG4gICAgICAgIHRoaXMuZnJpZW5kb25saW5lcyA9IFtdO1xuICAgICAgICB0aGlzLmZyaWVuZG9mZmxpbmVzID0gW107XG4gICAgICAgIHRoaXMuc3RyYW5nZXJvbmxpbmVkcyA9IFtdO1xuICAgICAgICB0aGlzLnN0cmFuZ2Vyb2ZmbGluZXMgPSBbXTtcbiAgICAgICAgdGhpcy5zeXN0ZW1zID0gW107XG4gICAgICAgIHRoaXMueW91cnNlbGZzID0gW107XG4gICAgfVxuXG4gICAgc2V0Tm90aWZ5QWxsKGVuYWJsZTogYm9vbGVhbik6IFNlc3Npb25CdWlsZGVyIHtcbiAgICAgICAgdGhpcy5hdXRoZGF0YVsnbm90aWZ5QWxsJ10gPSBlbmFibGU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldEluc3RhbGxhdGlvbihpbnN0YWxsYXRpb246IHN0cmluZyk6IFNlc3Npb25CdWlsZGVyIHtcbiAgICAgICAgdGhpcy5hdXRoZGF0YVsnaW5zdGFsbCddID0gaW5zdGFsbGF0aW9uO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkZyaWVuZE1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICB0aGlzLmZyaWVuZHMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25Hcm91cE1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjM8c3RyaW5nLHN0cmluZyxNZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIHRoaXMuZ3JvdXBzLnB1c2goaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uUm9vbU1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjM8c3RyaW5nLHN0cmluZyxNZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIHRoaXMucm9vbXMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25QYXNzZW5nZXJNZXNzYWdlKGhhbmRsZXI6IEhhbmRsZXIyPHN0cmluZyxNZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIHRoaXMucGFzc2VuZ2Vycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvblN0cmFuZ2VyTWVzc2FnZShoYW5kbGVyOiBIYW5kbGVyMjxzdHJpbmcsTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICB0aGlzLnN0cmFuZ2Vycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbkZyaWVuZE9ubGluZShoYW5kbGVyOiBIYW5kbGVyMTxzdHJpbmc+KTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICB0aGlzLmZyaWVuZG9ubGluZXMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25GcmllbmRPZmZsaW5lKGhhbmRsZXI6IEhhbmRsZXIxPHN0cmluZz4pOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIHRoaXMuZnJpZW5kb2ZmbGluZXMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25TdHJhbmdlck9ubGluZShoYW5kbGVyOiBIYW5kbGVyMTxzdHJpbmc+KTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICB0aGlzLnN0cmFuZ2Vyb25saW5lZHMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgb25TdHJhbmdlck9mZmxpbmUoaGFuZGxlcjogSGFuZGxlcjE8c3RyaW5nPik6IFNlc3Npb25CdWlsZGVyIHtcbiAgICAgICAgdGhpcy5zdHJhbmdlcm9mZmxpbmVzLnB1c2goaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uU3lzdGVtTWVzc2FnZShoYW5kbGVyOiBIYW5kbGVyMTxTeXN0ZW1NZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlciB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvbllvdXJzZWxmKGhhbmRsZXI6IEhhbmRsZXIxPFlvdXJzZWxmTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXIge1xuICAgICAgICB0aGlzLnlvdXJzZWxmcy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cblxuICAgIG9rKGNhbGxiYWNrOiBDYWxsYmFjazI8U2Vzc2lvbixDb250ZXh0Pikge1xuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy5hcGlPcHRpb25zLnNlcnZlcn0vY2hhdGA7XG4gICAgICAgIGxldCBzb2NrZXQgPSBpby5jb25uZWN0KHVybCwge1xuICAgICAgICAgICAgcXVlcnk6IGBhdXRoPSR7SlNPTi5zdHJpbmdpZnkodGhpcy5hdXRoZGF0YSl9YCxcbiAgICAgICAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbmNlKCdsb2dpbicsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBsZXQgZm9vID0gcmVzdWx0IGFzIExvZ2luUmVzdWx0O1xuICAgICAgICAgICAgaWYgKGZvby5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlc3Npb24gPSBuZXcgU2Vzc2lvbkltcGwoc29ja2V0LCBmb28uaWQpO1xuICAgICAgICAgICAgICAgIGxldCBjdHggPSBuZXcgQ29udGV4dEltcGwodGhpcy5hcGlPcHRpb25zLCByZXN1bHQuaWQpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHNlc3Npb24sIGN0eCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihgZXJyb3I6ICR7Zm9vLmVycm9yfWApLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgaW5jb21lID0+IHtcbiAgICAgICAgICAgIGxldCBtc2cgPSBpbmNvbWUgYXMgTWVzc2FnZUZyb207XG4gICAgICAgICAgICBsZXQgYmFzaWNtc2cgPSBjb252ZXJ0MmJhc2ljKG1zZyk7XG4gICAgICAgICAgICBzd2l0Y2ggKG1zZy5mcm9tLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFJlY2VpdmVyLkFDVE9SOlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuZnJpZW5kcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcihtc2cuZnJvbS5pZCwgYmFzaWNtc2cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgUmVjZWl2ZXIuR1JPVVA6XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5ncm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobXNnLmZyb20uZ2lkLCBtc2cuZnJvbS5pZCwgYmFzaWNtc2cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgUmVjZWl2ZXIuUk9PTTpcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLnJvb21zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1zZy5mcm9tLmdpZCwgbXNnLmZyb20uaWQsIGJhc2ljbXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFJlY2VpdmVyLlBBU1NFTkdFUjpcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLnBhc3NlbmdlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIobXNnLmZyb20uaWQsIGJhc2ljbXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFJlY2VpdmVyLlNUUkFOR0VSOlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuc3RyYW5nZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1zZy5mcm9tLmlkLCBiYXNpY21zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignb25saW5lJywgb25saW5laWQgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLmZyaWVuZG9ubGluZXMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG9ubGluZWlkIGFzIHN0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignb2ZmbGluZScsIG9mZmxpbmVpZD0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5mcmllbmRvZmZsaW5lcykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIob2ZmbGluZWlkIGFzIHN0cmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignb25saW5lX3gnLCBvbmxpbmVpZCA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuc3RyYW5nZXJvbmxpbmVkcykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIob25saW5laWQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdvZmZsaW5lX3gnLCBvZmZsaW5laWQgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLnN0cmFuZ2Vyb2ZmbGluZXMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG9mZmxpbmVpZCBhcyBzdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzb2NrZXQub24oJ3N5cycsIGluY29tZSA9PiB7XG4gICAgICAgICAgICBsZXQgbXNnID0gaW5jb21lIGFzIEJhc2ljTWVzc2FnZUZyb207XG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuc3lzdGVtcykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIobXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCd5b3Vyc2VsZicsIGluY29tZSA9PiB7XG4gICAgICAgICAgICBsZXQgbXNnID0gaW5jb21lIGFzIFlvdXJzZWxmTWVzc2FnZUZyb207XG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMueW91cnNlbGZzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIFNlc3Npb25JbXBsIGltcGxlbWVudHMgU2Vzc2lvbiB7XG4gICAgcHJpdmF0ZSBjbG9zZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSB1c2VyaWQ6IHN0cmluZztcblxuICAgIHNvY2tldDogU29ja2V0O1xuXG4gICAgY29uc3RydWN0b3Ioc29ja2V0OiBTb2NrZXQsIHVzZXJpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgICAgICB0aGlzLnVzZXJpZCA9IHVzZXJpZDtcbiAgICB9XG5cbiAgICBjdXJyZW50KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJpZDtcbiAgICB9XG5cbiAgICBzYXkodGV4dDogc3RyaW5nLCByZW1hcms/OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXNzaW9uIGlzIGNsb3NlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2VCdWlsZGVySW1wbCh0aGlzLCB0ZXh0LCByZW1hcmspO1xuICAgIH1cblxuICAgIGNsb3NlKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpO1xuICAgIH1cblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIGN1cnJlbnQoKTogc3RyaW5nO1xuICAgIHNheSh0ZXh0OiBzdHJpbmcsIHJlbWFyaz86IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIGNsb3NlKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25CdWlsZGVyIHtcbiAgICBzZXROb3RpZnlBbGwoZW5hYmxlOiBib29sZWFuKTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgc2V0SW5zdGFsbGF0aW9uKGluc3RhbGxhdGlvbjogc3RyaW5nKTogU2Vzc2lvbkJ1aWxkZXI7XG5cbiAgICBvbkZyaWVuZE1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgb25Hcm91cE1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjM8c3RyaW5nLCBzdHJpbmcsQmFzaWNNZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlcjtcbiAgICBvblJvb21NZXNzYWdlKGhhbmRsZXI6IEhhbmRsZXIzPHN0cmluZyxzdHJpbmcsQmFzaWNNZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlcjtcbiAgICBvblBhc3Nlbmdlck1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgb25TdHJhbmdlck1lc3NhZ2UoaGFuZGxlcjogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgb25GcmllbmRPbmxpbmUoaGFuZGxlcjogSGFuZGxlcjE8c3RyaW5nPik6IFNlc3Npb25CdWlsZGVyO1xuICAgIG9uRnJpZW5kT2ZmbGluZShoYW5kbGVyOiBIYW5kbGVyMTxzdHJpbmc+KTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgb25TdHJhbmdlck9ubGluZShoYW5kbGVyOiBIYW5kbGVyMTxzdHJpbmc+KTogU2Vzc2lvbkJ1aWxkZXI7XG4gICAgb25TdHJhbmdlck9mZmxpbmUoaGFuZGxlcjogSGFuZGxlcjE8c3RyaW5nPik6IFNlc3Npb25CdWlsZGVyO1xuICAgIG9uU3lzdGVtTWVzc2FnZShoYW5kbGVyOiBIYW5kbGVyMTxTeXN0ZW1NZXNzYWdlRnJvbT4pOiBTZXNzaW9uQnVpbGRlcjtcbiAgICBvbllvdXJzZWxmKGhhbmRsZXI6IEhhbmRsZXIxPFlvdXJzZWxmTWVzc2FnZUZyb20+KTogU2Vzc2lvbkJ1aWxkZXI7XG5cbiAgICBvayhjYWxsYmFjazogQ2FsbGJhY2syPFNlc3Npb24sQ29udGV4dD4pO1xufVxuIl19
