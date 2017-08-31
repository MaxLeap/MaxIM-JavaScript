var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../common/common", "./buildAttribute", "./buildMessage", "./cmdCreate", "./cmdDestroy", "./cmdMemberAppend", "./cmdMemberRemove"], function (require, exports, common_1, buildAttribute_1, buildMessage_1, cmdCreate_1, cmdDestroy_1, cmdMemberAppend_1, cmdMemberRemove_1) {
    "use strict";
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
            _super.apply(this, arguments);
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
});

//# sourceMappingURL=admin.js.map
