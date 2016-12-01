var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../model/messages", "../helper/md5", "./common", "../helper/utils", 'socket.io-client'], factory);
    }
})(function (require, exports) {
    "use strict";
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
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2aWNlL3Bhc3Nlbmdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUNBLHlCQUFzRixtQkFBbUIsQ0FBQyxDQUFBO0lBQzFHLG9CQUFrQixlQUFlLENBQUMsQ0FBQTtJQUNsQyx1QkFBK0MsVUFBVSxDQUFDLENBQUE7SUFDMUQsc0JBQXlDLGlCQUFpQixDQUFDLENBQUE7SUFDM0QsSUFBTyxFQUFFLFdBQVcsa0JBQWtCLENBQUMsQ0FBQztJQStDeEM7UUFLSSw0QkFBWSxPQUE2QixFQUFFLElBQVksRUFBRSxNQUFlO1lBQ3BFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUc7Z0JBQ1gsRUFBRSxFQUFFO29CQUNBLEVBQUUsRUFBRSxJQUFJO2lCQUNYO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxLQUFLLEVBQUUsZ0JBQUssQ0FBQyxJQUFJO29CQUNqQixJQUFJLEVBQUUsSUFBSTtpQkFDYjthQUNKLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2pDLENBQUM7UUFDTCxDQUFDO1FBRU8saURBQW9CLEdBQTVCO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUMzQixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzdCLENBQUM7UUFFRCx3Q0FBVyxHQUFYO1lBQ0ksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCx5Q0FBWSxHQUFaLFVBQWEsS0FBYTtZQUN0QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELHlDQUFZLEdBQVosVUFBYSxLQUFhO1lBQ3RCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsb0RBQXVCLEdBQXZCLFVBQXdCLGdCQUF5QjtZQUM3QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztZQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCwwQ0FBYSxHQUFiLFVBQWMsTUFBYztZQUN4QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELDBDQUFhLEdBQWIsVUFBYyxNQUFjO1lBQ3hCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsaURBQW9CLEdBQXBCLFVBQXFCLElBQVk7WUFDN0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxtQ0FBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGdCQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELG9DQUFPLEdBQVA7WUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsZ0JBQUssQ0FBQyxLQUFLLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsb0NBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxnQkFBSyxDQUFDLEtBQUssQ0FBQztZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxvQ0FBTyxHQUFQO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGdCQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELG1DQUFNLEdBQU4sVUFBTyxNQUFjO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFDNUIsTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVMLHlCQUFDO0lBQUQsQ0F4RkEsQUF3RkMsSUFBQTtJQUVEO1FBS0ksNkJBQVksT0FBNkIsRUFBRSxPQUFrQjtZQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUM1QixDQUFDO1FBRUQsZ0NBQUUsR0FBRixVQUFHLFFBQXlCO1lBQ3hCLElBQUksQ0FBQztnQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN6QixDQUFDO1lBQ0wsQ0FBRTtZQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQUNMLDBCQUFDO0lBQUQsQ0F2QkEsQUF1QkMsSUFBQTtJQUdEO1FBT0ksOEJBQVksTUFBYyxFQUFFLFdBQW1CO1lBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDO1FBQzNCLENBQUM7UUFFRCxrQ0FBRyxHQUFILFVBQUksSUFBWSxFQUFFLE1BQWU7WUFDN0IsTUFBTSxDQUFDLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQsb0NBQUssR0FBTCxVQUFNLFFBQXlCO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFFTCwyQkFBQztJQUFELENBeEJBLEFBd0JDLElBQUE7SUFFRDtRQUFtQyx3Q0FBaUI7UUFJaEQsOEJBQVksT0FBbUIsRUFBRSxHQUFXO1lBQ3hDLGtCQUFNLE9BQU8sQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDcEIsQ0FBQztRQUVELHNDQUFPLEdBQVA7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO1FBRUwsMkJBQUM7SUFBRCxDQWJBLEFBYUMsQ0Fia0MsMEJBQWlCLEdBYW5EO0lBRUQ7UUFVSSw4QkFBWSxPQUFtQixFQUFFLEVBQVc7WUFOcEMsZ0JBQVcsR0FBZSxFQUFFLENBQUM7WUFDN0IsY0FBUyxHQUF3QyxFQUFFLENBQUM7WUFDcEQsZ0JBQVcsR0FBaUMsRUFBRSxDQUFDO1lBQy9DLHdCQUFtQixHQUF1QixFQUFFLENBQUM7WUFDN0MseUJBQW9CLEdBQXVCLEVBQUUsQ0FBQztZQUdsRCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBRUQsd0NBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxLQUFVO1lBQzlCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELDRDQUFhLEdBQWIsVUFBYyxRQUE0QztZQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCw4Q0FBZSxHQUFmLFVBQWdCLFFBQW9DO1lBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELCtDQUFnQixHQUFoQixVQUFpQixRQUEwQjtZQUN2QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELGdEQUFpQixHQUFqQixVQUFrQixRQUEwQjtZQUN4QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVELGlDQUFFLEdBQUYsVUFBRyxRQUF1RDtZQUExRCxpQkF1RUM7WUF0RUcsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLFVBQU8sQ0FBQztZQUV6QyxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQy9CLElBQUksR0FBRyxHQUFHLFNBQUcsQ0FBQyxLQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDekQsSUFBSSxRQUFRLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRztnQkFDdEIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsU0FBUyxFQUFFLEVBQUU7YUFDaEIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDYixRQUFRLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUN4QyxDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLEtBQUssRUFBRSxVQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFHO2dCQUN6QyxVQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBQSxNQUFNO2dCQUN2QixJQUFJLEdBQUcsR0FBRyxNQUFxQixDQUFDO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDZCxJQUFJLE9BQU8sR0FBRyxJQUFJLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3ZELElBQUksR0FBRyxHQUFHLElBQUksb0JBQW9CLENBQUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksR0FBRyxHQUFHLElBQUksbUJBQVcsQ0FBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO29CQUNwRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUEsTUFBTTtnQkFDdkIsSUFBSSxHQUFHLEdBQUcsTUFBcUIsQ0FBQztnQkFDaEMsSUFBSSxRQUFRLEdBQUcscUJBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFbEMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwQixLQUFLLG1CQUFRLENBQUMsS0FBSzt3QkFDZixHQUFHLENBQUMsQ0FBZ0IsVUFBYyxFQUFkLEtBQUEsS0FBSSxDQUFDLFNBQVMsRUFBZCxjQUFjLEVBQWQsSUFBYyxDQUFDOzRCQUE5QixJQUFJLE9BQU8sU0FBQTs0QkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7eUJBQ2xDO3dCQUNELEtBQUssQ0FBQztvQkFDVjt3QkFDSSxLQUFLLENBQUM7Z0JBQ2QsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBQSxRQUFRO2dCQUMxQixHQUFHLENBQUMsQ0FBZ0IsVUFBd0IsRUFBeEIsS0FBQSxLQUFJLENBQUMsbUJBQW1CLEVBQXhCLGNBQXdCLEVBQXhCLElBQXdCLENBQUM7b0JBQXhDLElBQUksT0FBTyxTQUFBO29CQUNaLE9BQU8sQ0FBQyxRQUFrQixDQUFDLENBQUM7aUJBQy9CO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFBLFNBQVM7Z0JBQzVCLEdBQUcsQ0FBQyxDQUFnQixVQUF5QixFQUF6QixLQUFBLEtBQUksQ0FBQyxvQkFBb0IsRUFBekIsY0FBeUIsRUFBekIsSUFBeUIsQ0FBQztvQkFBekMsSUFBSSxPQUFPLFNBQUE7b0JBQ1osT0FBTyxDQUFDLFNBQW1CLENBQUMsQ0FBQztpQkFDaEM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFVBQUEsTUFBTTtnQkFDbkIsSUFBSSxHQUFHLEdBQUcsTUFBMEIsQ0FBQztnQkFDckMsR0FBRyxDQUFDLENBQWdCLFVBQWdCLEVBQWhCLEtBQUEsS0FBSSxDQUFDLFdBQVcsRUFBaEIsY0FBZ0IsRUFBaEIsSUFBZ0IsQ0FBQztvQkFBaEMsSUFBSSxPQUFPLFNBQUE7b0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLDJCQUFDO0lBQUQsQ0FoSEEsQUFnSEMsSUFBQTtJQUlHLDRCQUFvQix3QkFKdkI7SUFLQSIsImZpbGUiOiJzZXJ2aWNlL3Bhc3Nlbmdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2FsbGJhY2syLCBBdHRyaWJ1dGVzLCBBUElPcHRpb25zLCBIYW5kbGVyMiwgSGFuZGxlcjEsIExvZ2luUmVzdWx0LCBDYWxsYmFja30gZnJvbSBcIi4uL21vZGVsL21vZGVsc1wiO1xuaW1wb3J0IHtCYXNpY01lc3NhZ2VGcm9tLCBNZXNzYWdlVG8sIE1lZGlhLCBNZXNzYWdlRnJvbSwgUmVjZWl2ZXIsIFB1c2hTZXR0aW5nc30gZnJvbSBcIi4uL21vZGVsL21lc3NhZ2VzXCI7XG5pbXBvcnQge21kNX0gZnJvbSBcIi4uL2hlbHBlci9tZDVcIjtcbmltcG9ydCB7Q29tbW9uU2VydmljZSwgQ29tbW9uU2VydmljZUltcGx9IGZyb20gXCIuL2NvbW1vblwiO1xuaW1wb3J0IHtQYXJyb3RFcnJvciwgY29udmVydDJiYXNpY30gZnJvbSBcIi4uL2hlbHBlci91dGlsc1wiO1xuaW1wb3J0IGlvID0gcmVxdWlyZSgnc29ja2V0LmlvLWNsaWVudCcpO1xuaW1wb3J0IFNvY2tldCA9IFNvY2tldElPQ2xpZW50LlNvY2tldDtcblxuXG5pbnRlcmZhY2UgUGFzc2VuZ2VyQnVpbGRlciB7XG4gICAgYXR0cmlidXRlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IFBhc3NlbmdlckJ1aWxkZXI7XG4gICAgb25Vc2VyTWVzc2FnZShjYWxsYmFjazogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+KTogUGFzc2VuZ2VyQnVpbGRlcjtcbiAgICBvblN5c3RlbU1lc3NhZ2UoY2FsbGJhY2s6IEhhbmRsZXIxPEJhc2ljTWVzc2FnZUZyb20+KTogUGFzc2VuZ2VyQnVpbGRlcjtcbiAgICBvblN0cmFuZ2VyT25saW5lKGNhbGxiYWNrOiBIYW5kbGVyMTxzdHJpbmc+KTogUGFzc2VuZ2VyQnVpbGRlcjtcbiAgICBvblN0cmFuZ2VyT2ZmbGluZShjYWxsYmFjazogSGFuZGxlcjE8c3RyaW5nPik6IFBhc3NlbmdlckJ1aWxkZXI7XG4gICAgb2soY2FsbGJhY2s6IENhbGxiYWNrMjxQYXNzZW5nZXJTZXNzaW9uLFBhc3NlbmdlckNvbnRleHQ+KTtcbn1cblxuaW50ZXJmYWNlIFBhc3NlbmdlclNlc3Npb24ge1xuICAgIHNheSh0ZXh0OiBzdHJpbmcsIHJlbWFyaz86IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIGNsb3NlKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pO1xufVxuXG5cbmludGVyZmFjZSBNZXNzYWdlQnVpbGRlciB7XG5cbiAgICBhc1RleHQoKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgYXNJbWFnZSgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBhc0F1ZGlvKCk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIGFzVmlkZW8oKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICBkaXNhYmxlUHVzaCgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU291bmQoc291bmQ6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hCYWRnZShiYWRnZTogbnVtYmVyKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hQcmVmaXgocHJlZml4OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU3VmZml4KHN1ZmZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaFRleHRPdmVyd3JpdGUodGV4dDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICB0b1VzZXIodXNlcmlkOiBzdHJpbmcpOiBNZXNzYWdlTGF1bmNoZXI7XG59XG5cbmludGVyZmFjZSBNZXNzYWdlTGF1bmNoZXIge1xuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBQYXNzZW5nZXJTZXNzaW9uO1xufVxuXG5pbnRlcmZhY2UgUGFzc2VuZ2VyQ29udGV4dCBleHRlbmRzIENvbW1vblNlcnZpY2Uge1xuXG4gICAgY3VycmVudCgpOiBzdHJpbmc7XG5cbn1cblxuY2xhc3MgTWVzc2FnZUJ1aWxkZXJJbXBsIGltcGxlbWVudHMgTWVzc2FnZUJ1aWxkZXIge1xuXG4gICAgbWVzc2FnZTogTWVzc2FnZVRvO1xuICAgIHNlc3Npb246IFBhc3NlbmdlclNlc3Npb25JbXBsO1xuXG4gICAgY29uc3RydWN0b3Ioc2Vzc2lvbjogUGFzc2VuZ2VyU2Vzc2lvbkltcGwsIHRleHQ6IHN0cmluZywgcmVtYXJrPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IHNlc3Npb247XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IHtcbiAgICAgICAgICAgIHRvOiB7XG4gICAgICAgICAgICAgICAgaWQ6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgbWVkaWE6IE1lZGlhLlRFWFQsXG4gICAgICAgICAgICAgICAgYm9keTogdGV4dFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAocmVtYXJrICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5yZW1hcmsgPSByZW1hcms7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVB1c2hJZk5vdEV4aXN0KCk6IFB1c2hTZXR0aW5ncyB7XG4gICAgICAgIGlmICghdGhpcy5tZXNzYWdlLnB1c2gpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5wdXNoID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZS5wdXNoO1xuICAgIH1cblxuICAgIGRpc2FibGVQdXNoKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLmVuYWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoU291bmQoc291bmQ6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLnNvdW5kID0gc291bmQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldFB1c2hCYWRnZShiYWRnZTogbnVtYmVyKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkuYmFkZ2UgPSBiYWRnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5jcmVhdGVQdXNoSWZOb3RFeGlzdCgpLmNvbnRlbnRBdmFpbGFibGUgPSBjb250ZW50QXZhaWxhYmxlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoUHJlZml4KHByZWZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkucHJlZml4ID0gcHJlZml4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoU3VmZml4KHN1ZmZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmNyZWF0ZVB1c2hJZk5vdEV4aXN0KCkuc3VmZml4ID0gc3VmZml4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoVGV4dE92ZXJ3cml0ZSh0ZXh0OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHVzaElmTm90RXhpc3QoKS5vdmVyd3JpdGUgPSB0ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc1RleHQoKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLm1lc3NhZ2UuY29udGVudC5tZWRpYSA9IE1lZGlhLlRFWFQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFzSW1hZ2UoKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICB0aGlzLm1lc3NhZ2UuY29udGVudC5tZWRpYSA9IE1lZGlhLklNQUdFO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc0F1ZGlvKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQubWVkaWEgPSBNZWRpYS5BVURJTztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXNWaWRlbygpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS5jb250ZW50Lm1lZGlhID0gTWVkaWEuVklERU87XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRvVXNlcih1c2VyaWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS50by5pZCA9IHVzZXJpZDtcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlTGF1bmNoZXJJbXBsKHRoaXMuc2Vzc2lvbiwgdGhpcy5tZXNzYWdlKTtcbiAgICB9XG5cbn1cblxuY2xhc3MgTWVzc2FnZUxhdW5jaGVySW1wbCBpbXBsZW1lbnRzIE1lc3NhZ2VMYXVuY2hlciB7XG5cbiAgICBwcml2YXRlIF9zZXNzaW9uOiBQYXNzZW5nZXJTZXNzaW9uSW1wbDtcbiAgICBwcml2YXRlIF9tZXNzYWdlOiBNZXNzYWdlVG87XG5cbiAgICBjb25zdHJ1Y3RvcihzZXNzaW9uOiBQYXNzZW5nZXJTZXNzaW9uSW1wbCwgbWVzc2FnZTogTWVzc2FnZVRvKSB7XG4gICAgICAgIHRoaXMuX3Nlc3Npb24gPSBzZXNzaW9uO1xuICAgICAgICB0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICBvayhjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogUGFzc2VuZ2VyU2Vzc2lvbiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9zZXNzaW9uLl9zb2NrZXQuZW1pdCgnc2F5JywgdGhpcy5fbWVzc2FnZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nlc3Npb247XG4gICAgfVxufVxuXG5cbmNsYXNzIFBhc3NlbmdlclNlc3Npb25JbXBsIGltcGxlbWVudHMgUGFzc2VuZ2VyU2Vzc2lvbiB7XG5cbiAgICBfc29ja2V0OiBTb2NrZXQ7XG4gICAgX2lkOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9jbG9zZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQ6IFNvY2tldCwgcGFzc2VuZ2VyaWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgIHRoaXMuX2lkID0gcGFzc2VuZ2VyaWQ7XG4gICAgfVxuXG4gICAgc2F5KHRleHQ6IHN0cmluZywgcmVtYXJrPzogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2VCdWlsZGVySW1wbCh0aGlzLCB0ZXh0LCByZW1hcmspO1xuICAgIH1cblxuICAgIGNsb3NlKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pIHtcbiAgICAgICAgaWYgKHRoaXMuX2Nsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NvY2tldC5jbG9zZSgpO1xuICAgIH1cblxufVxuXG5jbGFzcyBQYXNzZW5nZXJDb250ZXh0SW1wbCBleHRlbmRzIENvbW1vblNlcnZpY2VJbXBsIGltcGxlbWVudHMgUGFzc2VuZ2VyQ29udGV4dCB7XG5cbiAgICBwcml2YXRlIF95b3U6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFQSU9wdGlvbnMsIHlvdTogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl95b3UgPSB5b3U7XG4gICAgfVxuXG4gICAgY3VycmVudCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5feW91O1xuICAgIH1cblxufVxuXG5jbGFzcyBQYXNzZW5nZXJCdWlsZGVySW1wbCBpbXBsZW1lbnRzIFBhc3NlbmdlckJ1aWxkZXIge1xuXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgICBwcml2YXRlIF9vcHRpb25zOiBBUElPcHRpb25zO1xuICAgIHByaXZhdGUgX2F0dHJpYnV0ZXM6IEF0dHJpYnV0ZXMgPSBbXTtcbiAgICBwcml2YXRlIF9mcm9tdXNlcjogSGFuZGxlcjI8c3RyaW5nLEJhc2ljTWVzc2FnZUZyb20+W10gPSBbXTtcbiAgICBwcml2YXRlIF9mcm9tc3lzdGVtOiBIYW5kbGVyMTxCYXNpY01lc3NhZ2VGcm9tPltdID0gW107XG4gICAgcHJpdmF0ZSBfZnJvbVN0cmFuZ2VyT25saW5lOiBIYW5kbGVyMTxzdHJpbmc+W10gPSBbXTtcbiAgICBwcml2YXRlIF9mcm9tU3RyYW5nZXJPZmZsaW5lOiBIYW5kbGVyMTxzdHJpbmc+W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFQSU9wdGlvbnMsIGlkPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLl9pZCA9IGlkO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQYXNzZW5nZXJCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5fYXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvblVzZXJNZXNzYWdlKGNhbGxiYWNrOiBIYW5kbGVyMjxzdHJpbmcsIEJhc2ljTWVzc2FnZUZyb20+KTogUGFzc2VuZ2VyQnVpbGRlciB7XG4gICAgICAgIHRoaXMuX2Zyb211c2VyLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvblN5c3RlbU1lc3NhZ2UoY2FsbGJhY2s6IEhhbmRsZXIxPEJhc2ljTWVzc2FnZUZyb20+KTogUGFzc2VuZ2VyQnVpbGRlciB7XG4gICAgICAgIHRoaXMuX2Zyb21zeXN0ZW0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9uU3RyYW5nZXJPbmxpbmUoY2FsbGJhY2s6IEhhbmRsZXIxPHN0cmluZz4pOiBQYXNzZW5nZXJCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5fZnJvbVN0cmFuZ2VyT25saW5lLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvblN0cmFuZ2VyT2ZmbGluZShjYWxsYmFjazogSGFuZGxlcjE8c3RyaW5nPik6IFBhc3NlbmdlckJ1aWxkZXIge1xuICAgICAgICB0aGlzLl9mcm9tU3RyYW5nZXJPZmZsaW5lLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvayhjYWxsYmFjazogQ2FsbGJhY2syPFBhc3NlbmdlclNlc3Npb24sIFBhc3NlbmdlckNvbnRleHQ+KSB7XG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLl9vcHRpb25zLnNlcnZlcn0vY2hhdGA7XG5cbiAgICAgICAgbGV0IGZvbyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgYmFyID0gbWQ1KGAke2Zvb30ke3RoaXMuX29wdGlvbnMuc2lnbn1gKSArICcsJyArIGZvbztcbiAgICAgICAgbGV0IGF1dGhkYXRhID0ge1xuICAgICAgICAgICAgYXBwOiB0aGlzLl9vcHRpb25zLmFwcCxcbiAgICAgICAgICAgIHNpZ246IGJhcixcbiAgICAgICAgICAgIHBhc3Nlbmdlcjoge31cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuX2F0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmIChrID09PSAnaWQnKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdXRoZGF0YS5wYXNzZW5nZXJba10gPSB0aGlzLl9hdHRyaWJ1dGVzW2tdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2lkKSB7XG4gICAgICAgICAgICBhdXRoZGF0YS5wYXNzZW5nZXJbJ2lkJ10gPSB0aGlzLl9pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzb2NrZXQgPSBpby5jb25uZWN0KHVybCwge1xuICAgICAgICAgICAgcXVlcnk6IGBhdXRoPSR7SlNPTi5zdHJpbmdpZnkoYXV0aGRhdGEpfWAsXG4gICAgICAgICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgICAgIH0pO1xuICAgICAgICBzb2NrZXQub25jZSgnbG9naW4nLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgbGV0IGZvbyA9IHJlc3VsdCBhcyBMb2dpblJlc3VsdDtcbiAgICAgICAgICAgIGlmIChmb28uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGxldCBzZXNzaW9uID0gbmV3IFBhc3NlbmdlclNlc3Npb25JbXBsKHNvY2tldCwgZm9vLmlkKTtcbiAgICAgICAgICAgICAgICBsZXQgY3R4ID0gbmV3IFBhc3NlbmdlckNvbnRleHRJbXBsKHRoaXMuX29wdGlvbnMsIGZvby5pZCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgc2Vzc2lvbiwgY3R4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGVyciA9IG5ldyBQYXJyb3RFcnJvcih7ZXJyb3JDb2RlOiBmb28uZXJyb3IsIGVycm9yTWVzc2FnZTogJyd9KTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzb2NrZXQub24oJ21lc3NhZ2UnLCBpbmNvbWU9PiB7XG4gICAgICAgICAgICBsZXQgbXNnID0gaW5jb21lIGFzIE1lc3NhZ2VGcm9tO1xuICAgICAgICAgICAgbGV0IGJhc2ljbXNnID0gY29udmVydDJiYXNpYyhtc2cpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG1zZy5mcm9tLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFJlY2VpdmVyLkFDVE9SOlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX2Zyb211c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKG1zZy5mcm9tLmlkLCBiYXNpY21zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignb25saW5lX3gnLCBvbmxpbmVpZCA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuX2Zyb21TdHJhbmdlck9ubGluZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIob25saW5laWQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdvZmZsaW5lX3gnLCBvZmZsaW5laWQgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9mcm9tU3RyYW5nZXJPZmZsaW5lKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihvZmZsaW5laWQgYXMgc3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc29ja2V0Lm9uKCdzeXMnLCBpbmNvbWUgPT4ge1xuICAgICAgICAgICAgbGV0IG1zZyA9IGluY29tZSBhcyBCYXNpY01lc3NhZ2VGcm9tO1xuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiB0aGlzLl9mcm9tc3lzdGVtKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcihtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgUGFzc2VuZ2VyQnVpbGRlcixcbiAgICBQYXNzZW5nZXJCdWlsZGVySW1wbFxufSJdfQ==
