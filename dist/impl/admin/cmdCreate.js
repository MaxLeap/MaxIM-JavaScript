define(["require", "exports", "./buildGroup", "./buildRoom"], function (require, exports, buildGroup_1, buildRoom_1) {
    "use strict";
    var CreateCommandImpl = (function () {
        function CreateCommandImpl(admin) {
            this.admin = admin;
        }
        CreateCommandImpl.prototype.group = function (owner) {
            return new buildGroup_1.GroupBuilderImpl(this.admin, owner);
        };
        CreateCommandImpl.prototype.room = function () {
            return new buildRoom_1.RoomBuilderImpl(this.admin);
        };
        return CreateCommandImpl;
    }());
    exports.CreateCommandImpl = CreateCommandImpl;
});

//# sourceMappingURL=cmdCreate.js.map
