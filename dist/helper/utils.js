var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
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
                errorMessage: this.errorMessage
            };
        };
        return ParrotError;
    }(Error));
    exports.ParrotError = ParrotError;
});
