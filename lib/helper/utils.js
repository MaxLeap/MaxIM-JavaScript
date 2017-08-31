"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParrotError = (function (_super) {
    __extends(ParrotError, _super);
    function ParrotError(error) {
        _super.call(this, error.errorMessage);
        this.errorCode = error.errorCode;
        this.errorMessage = error.errorMessage;
        this.message = error.errorMessage;
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

//# sourceMappingURL=utils.js.map
