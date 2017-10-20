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
    var PassengerMessageLauncherImpl = (function () {
        function PassengerMessageLauncherImpl(session, message) {
            this.session = session;
            this.msg = message;
        }
        PassengerMessageLauncherImpl.prototype.ok = function (callback) {
            try {
                this.session.socket.emit("say", this.msg);
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
        return PassengerMessageLauncherImpl;
    }());
    exports.PassengerMessageLauncherImpl = PassengerMessageLauncherImpl;
});
