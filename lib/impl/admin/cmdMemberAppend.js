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
    var MemberAppendCommandImpl = (function () {
        function MemberAppendCommandImpl(admin, members) {
            this.admin = admin;
            this.members = {
                members: members,
            };
        }
        MemberAppendCommandImpl.prototype.intoRoom = function (roomid, callback) {
            return this.invokeAppend("/rooms/" + roomid, callback);
        };
        MemberAppendCommandImpl.prototype.intoGroup = function (groupid, callback) {
            return this.invokeAppend("/groups/" + groupid, callback);
        };
        MemberAppendCommandImpl.prototype.invokeAppend = function (path, callback) {
            var url = "" + this.admin.options().server + path + "/members";
            axios_1.default.post(url, JSON.stringify(this.members), { headers: this.admin.options().headers })
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
        return MemberAppendCommandImpl;
    }());
    exports.MemberAppendCommandImpl = MemberAppendCommandImpl;
});
