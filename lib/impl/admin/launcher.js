(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../model/messages", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var messages_1 = require("../../model/messages");
    var axios_1 = require("axios");
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
            axios_1.default.post(url, JSON.stringify(this.message), { headers: this.admin.options().headers })
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
});
