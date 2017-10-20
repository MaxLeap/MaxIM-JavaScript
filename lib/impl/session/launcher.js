(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageLauncherImpl = (function () {
        function MessageLauncherImpl(session, message) {
            this.session = session;
            this.message = message;
        }
        MessageLauncherImpl.prototype.ok = function (callback) {
            try {
                this.session.socket.emit("say", this.message);
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
    exports.MessageLauncherImpl = MessageLauncherImpl;
});
