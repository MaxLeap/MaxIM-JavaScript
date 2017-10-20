(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./destroyGroup", "./destroyRoom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var destroyGroup_1 = require("./destroyGroup");
    var destroyRoom_1 = require("./destroyRoom");
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
