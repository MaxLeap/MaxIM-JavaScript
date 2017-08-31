"use strict";
var GroupDestroyImpl = (function () {
    function GroupDestroyImpl(admin, groupid) {
        this.admin = admin;
        this.groupid = groupid;
    }
    GroupDestroyImpl.prototype.ok = function (callback) {
        var url = this.admin.options().server + "/groups/" + this.groupid;
        axios.delete(url, { headers: this.admin.options().headers })
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

//# sourceMappingURL=destroyGroup.js.map
