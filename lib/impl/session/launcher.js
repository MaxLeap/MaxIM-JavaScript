"use strict";
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

//# sourceMappingURL=launcher.js.map
