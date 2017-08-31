"use strict";
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

//# sourceMappingURL=launcher.js.map
