"use strict";
var messages_1 = require("../../model/messages");
var AdminMessageLauncherImpl = (function () {
    function AdminMessageLauncherImpl(admin, message, receiver) {
        this.admin = admin;
        this.message = message;
        this.receiver = receiver;
    }
    AdminMessageLauncherImpl.prototype.ok = function (callback) {
        var url = this.admin.options().server + "/system";
        if (this.receiver.id) {
            url += "/" + this.receiver.id;
            switch (this.receiver.type) {
                case messages_1.Receiver.GROUP:
                    url += "?group";
                    break;
                case messages_1.Receiver.ROOM:
                    url += "?room";
                    break;
                default:
                    break;
            }
        }
        axios.post(url, JSON.stringify(this.message), { headers: this.admin.options().headers })
            .then(function (ignore) {
            if (callback) {
                callback(null, null);
            }
        })
            .catch(function (e) {
            if (callback) {
                callback(e);
            }
        });
        return this.admin;
    };
    return AdminMessageLauncherImpl;
}());
exports.AdminMessageLauncherImpl = AdminMessageLauncherImpl;

//# sourceMappingURL=launcher.js.map
