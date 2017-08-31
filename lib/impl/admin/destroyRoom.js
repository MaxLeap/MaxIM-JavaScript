"use strict";
var RoomDestroyImpl = (function () {
    function RoomDestroyImpl(admin, roomid) {
        this.admin = admin;
        this.roomid = roomid;
    }
    RoomDestroyImpl.prototype.ok = function (callback) {
        var url = this.admin.options().server + "/rooms/" + this.roomid;
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
    return RoomDestroyImpl;
}());
exports.RoomDestroyImpl = RoomDestroyImpl;

//# sourceMappingURL=destroyRoom.js.map
