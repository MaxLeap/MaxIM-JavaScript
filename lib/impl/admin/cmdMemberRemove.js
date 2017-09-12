"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var MemberRemoveCommandImpl = (function () {
    function MemberRemoveCommandImpl(admin, members) {
        this.admin = admin;
        this.members = {
            members: members,
        };
    }
    MemberRemoveCommandImpl.prototype.fromRoom = function (roomid, callback) {
        return this.invokeDelete("/rooms/" + roomid, callback);
    };
    MemberRemoveCommandImpl.prototype.fromGroup = function (groupid, callback) {
        return this.invokeDelete("/groups/" + groupid, callback);
    };
    MemberRemoveCommandImpl.prototype.invokeDelete = function (path, callback) {
        var op = this.admin.options();
        var url = "" + op.server + path + "/members";
        var req = {
            url: url,
            method: "DELETE",
            data: JSON.stringify(this.members),
            headers: op.headers,
        };
        axios_1.default.request(req)
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
    return MemberRemoveCommandImpl;
}());
exports.MemberRemoveCommandImpl = MemberRemoveCommandImpl;
