(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./buildMessage"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var buildMessage_1 = require("./buildMessage");
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
                throw new Error("session is closed.");
            }
            return new buildMessage_1.MessageBuilderImpl(this, text, remark);
        };
        SessionImpl.prototype.close = function (callback) {
            if (!this.closed) {
                this.closed = true;
                this.socket.close();
            }
            if (callback) {
                callback();
            }
        };
        return SessionImpl;
    }());
    exports.SessionImpl = SessionImpl;
});
