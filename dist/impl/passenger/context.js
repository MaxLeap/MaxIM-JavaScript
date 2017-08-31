var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../common/common"], function (require, exports, common_1) {
    "use strict";
    var PassengerContextImpl = (function (_super) {
        __extends(PassengerContextImpl, _super);
        function PassengerContextImpl(options, you) {
            _super.call(this, options);
            this.you = you;
        }
        PassengerContextImpl.prototype.current = function () {
            return this.you;
        };
        return PassengerContextImpl;
    }(common_1.CommonServiceImpl));
    exports.PassengerContextImpl = PassengerContextImpl;
});

//# sourceMappingURL=context.js.map
