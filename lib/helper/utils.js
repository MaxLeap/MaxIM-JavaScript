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
var ParrotError = (function (_super) {
    __extends(ParrotError, _super);
    function ParrotError(error) {
        var _this = _super.call(this, error.errorMessage) || this;
        _this.errorCode = error.errorCode;
        _this.errorMessage = error.errorMessage;
        _this.message = error.errorMessage;
        return _this;
    }
    ParrotError.prototype.toJSON = function () {
        return {
            errorCode: this.errorCode,
            errorMessage: this.errorMessage,
        };
    };
    return ParrotError;
}(Error));
exports.ParrotError = ParrotError;
function convert2basic(origin) {
    var ret = {
        content: origin.content,
        ts: origin.ts,
    };
    if (origin.remark != null) {
        ret.remark = origin.remark;
    }
    return ret;
}
exports.convert2basic = convert2basic;
