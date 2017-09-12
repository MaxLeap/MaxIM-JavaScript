"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var md5_1 = require("../../helper/md5");
var utils_1 = require("../../helper/utils");
var messages_1 = require("../../model/messages");
var context_1 = require("./context");
var session_1 = require("./session");
var PassengerBuilderImpl = (function () {
    function PassengerBuilderImpl(options, id) {
        this.attributes = [];
        this.fromUser = [];
        this.fromSystem = [];
        this.fromStrangerOnline = [];
        this.fromStrangerOffline = [];
        this.acks = [];
        this.options = options;
        this.id = id;
    }
    PassengerBuilderImpl.prototype.attribute = function (name, value) {
        this.attributes[name] = value;
        return this;
    };
    PassengerBuilderImpl.prototype.onUserMessage = function (callback) {
        this.fromUser.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onSystemMessage = function (callback) {
        this.fromSystem.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onStrangerOnline = function (callback) {
        this.fromStrangerOnline.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onStrangerOffline = function (callback) {
        this.fromStrangerOffline.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.onAck = function (callback) {
        this.acks.push(callback);
        return this;
    };
    PassengerBuilderImpl.prototype.ok = function (callback) {
        var _this = this;
        var url = this.options.server + "/chat";
        var foo = new Date().getTime();
        var bar = md5_1.md5("" + foo + this.options.sign) + "," + foo;
        var qux = {};
        var authdata = {
            app: this.options.app,
            sign: bar,
            passenger: qux,
        };
        for (var k in this.attributes) {
            if (k === "id") {
                continue;
            }
            qux[k] = this.attributes[k];
        }
        if (this.id) {
            qux.id = this.id;
        }
        var socket = io.connect(url, {
            query: "auth=" + JSON.stringify(authdata),
            transports: ["websocket"],
        });
        socket.once("login", function (result) {
            var foo = result;
            if (foo.success) {
                var session = new session_1.PassengerSessionImpl(socket, foo.id);
                var ctx = new context_1.PassengerContextImpl(_this.options, foo.id);
                callback(null, session, ctx);
            }
            else {
                var err = new utils_1.ParrotError({ errorCode: foo.error, errorMessage: "" });
                callback(err);
            }
        });
        socket.on("message", function (income) {
            var msg = income;
            var basicmsg = utils_1.convert2basic(msg);
            switch (msg.from.type) {
                case messages_1.Receiver.ACTOR:
                    for (var _i = 0, _a = _this.fromUser; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });
        socket.on("online_x", function (onlineid) {
            for (var _i = 0, _a = _this.fromStrangerOnline; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(onlineid);
            }
        });
        socket.on("offline_x", function (offlineid) {
            for (var _i = 0, _a = _this.fromStrangerOffline; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(offlineid);
            }
        });
        socket.on("sys", function (income) {
            var msg = income;
            for (var _i = 0, _a = _this.fromSystem; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(msg);
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
    return PassengerBuilderImpl;
}());
exports.PassengerBuilderImpl = PassengerBuilderImpl;
