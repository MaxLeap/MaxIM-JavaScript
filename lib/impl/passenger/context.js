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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../common/common"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("../common/common");
    var PassengerContextImpl = (function (_super) {
        __extends(PassengerContextImpl, _super);
        function PassengerContextImpl(options, you) {
            var _this = _super.call(this, options) || this;
            _this.you = you;
            return _this;
        }
        PassengerContextImpl.prototype.current = function () {
            return this.you;
        };
        return PassengerContextImpl;
    }(common_1.CommonServiceImpl));
    exports.PassengerContextImpl = PassengerContextImpl;
});
