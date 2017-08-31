"use strict";
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
        axios.post(url, JSON.stringify(this.members), { headers: this.admin.options().headers })
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

//# sourceMappingURL=cmdMemberAppend.js.map
