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
    var PassengerSessionImpl = (function () {
        function PassengerSessionImpl(socket, passengerid) {
            this.socket = socket;
            this.id = passengerid;
        }
        PassengerSessionImpl.prototype.say = function (text, remark) {
            return new buildMessage_1.PassengerMessageBuilderImpl(this, text, remark);
        };
        PassengerSessionImpl.prototype.close = function (callback) {
            if (this.closed) {
                return;
            }
            this.closed = true;
            this.socket.close();
        };
        return PassengerSessionImpl;
    }());
    exports.PassengerSessionImpl = PassengerSessionImpl;
});
