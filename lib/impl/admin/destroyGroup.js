(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var axios_1 = require("axios");
    var GroupDestroyImpl = (function () {
        function GroupDestroyImpl(admin, groupid) {
            this.admin = admin;
            this.groupid = groupid;
        }
        GroupDestroyImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/groups/" + this.groupid;
            axios_1.default.delete(url, { headers: this.admin.options().headers })
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
        return GroupDestroyImpl;
    }());
    exports.GroupDestroyImpl = GroupDestroyImpl;
});
