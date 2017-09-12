"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common/common");
var buildAttribute_1 = require("./buildAttribute");
var buildMessage_1 = require("./buildMessage");
var cmdCreate_1 = require("./cmdCreate");
var cmdDestroy_1 = require("./cmdDestroy");
var cmdMemberAppend_1 = require("./cmdMemberAppend");
var cmdMemberRemove_1 = require("./cmdMemberRemove");
function concat(first) {
    var others = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        others[_i - 1] = arguments[_i];
    }
    var all = [];
    all.push(first);
    if (others && others.length > 0) {
        for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
            var s = others_1[_a];
            all.push(s);
        }
    }
    return all;
}
var AdminImpl = (function (_super) {
    __extends(AdminImpl, _super);
    function AdminImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdminImpl.prototype.say = function (text, remark) {
        return new buildMessage_1.AdminMessageBuilderImpl(this, text, remark);
    };
    AdminImpl.prototype.setAttributes = function (attributes, overwrite) {
        return new buildAttribute_1.AttributeBuilderImpl(this, attributes, overwrite);
    };
    AdminImpl.prototype.removeMembers = function (first) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        return new cmdMemberRemove_1.MemberRemoveCommandImpl(this, concat(first, others));
    };
    AdminImpl.prototype.appendMembers = function (first) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        return new cmdMemberAppend_1.MemberAppendCommandImpl(this, concat(first, others));
    };
    AdminImpl.prototype.create = function () {
        return new cmdCreate_1.CreateCommandImpl(this);
    };
    AdminImpl.prototype.destroy = function () {
        return new cmdDestroy_1.DestroyCommandImpl(this);
    };
    return AdminImpl;
}(common_1.CommonServiceImpl));
exports.AdminImpl = AdminImpl;
