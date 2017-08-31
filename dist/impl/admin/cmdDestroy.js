define(["require", "exports", "./destroyGroup", "./destroyRoom"], function (require, exports, destroyGroup_1, destroyRoom_1) {
    "use strict";
    var DestroyCommandImpl = (function () {
        function DestroyCommandImpl(admin) {
            this.admin = admin;
        }
        DestroyCommandImpl.prototype.group = function (groupid) {
            return new destroyGroup_1.GroupDestroyImpl(this.admin, groupid);
        };
        DestroyCommandImpl.prototype.room = function (roomid) {
            return new destroyRoom_1.RoomDestroyImpl(this.admin, roomid);
        };
        return DestroyCommandImpl;
    }());
    exports.DestroyCommandImpl = DestroyCommandImpl;
});

//# sourceMappingURL=cmdDestroy.js.map
