(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./buildGroup", "./buildRoom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var buildGroup_1 = require("./buildGroup");
    var buildRoom_1 = require("./buildRoom");
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
