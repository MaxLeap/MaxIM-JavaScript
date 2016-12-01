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
    function convert2basic(origin) {
        var ret = {
            content: origin.content,
            ts: origin.ts
        };
        if (origin.remark != null) {
            ret.remark = origin.remark;
        }
        return ret;
    }
    exports.convert2basic = convert2basic;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFDQTtRQUEwQiwrQkFBSztRQUszQixxQkFBWSxLQUErQztZQUN2RCxrQkFBTSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdEMsQ0FBQztRQUVELDRCQUFNLEdBQU47WUFDSSxNQUFNLENBQUM7Z0JBQ0gsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDbEMsQ0FBQztRQUNOLENBQUM7UUFDTCxrQkFBQztJQUFELENBbEJBLEFBa0JDLENBbEJ5QixLQUFLLEdBa0I5QjtJQWVHLG1CQUFXLGVBZmQ7SUFFRCx1QkFBdUIsTUFBbUI7UUFDdEMsSUFBSSxHQUFHLEdBQXFCO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztZQUN2QixFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUU7U0FDaEIsQ0FBQztRQUNGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDL0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0lBR0cscUJBQWEsaUJBSGhCO0lBS0EiLCJmaWxlIjoiaGVscGVyL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNZXNzYWdlRnJvbSwgQmFzaWNNZXNzYWdlRnJvbX0gZnJvbSBcIi4uL21vZGVsL21lc3NhZ2VzXCI7XG5jbGFzcyBQYXJyb3RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xuICAgIHB1YmxpYyBlcnJvckNvZGU6IG51bWJlcjtcbiAgICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihlcnJvcjoge2Vycm9yQ29kZTogbnVtYmVyLGVycm9yTWVzc2FnZTogc3RyaW5nfSkge1xuICAgICAgICBzdXBlcihlcnJvci5lcnJvck1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmVycm9yQ29kZSA9IGVycm9yLmVycm9yQ29kZTtcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvci5lcnJvck1lc3NhZ2U7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGVycm9yLmVycm9yTWVzc2FnZTtcbiAgICB9XG5cbiAgICB0b0pTT04oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yQ29kZTogdGhpcy5lcnJvckNvZGUsXG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IHRoaXMuZXJyb3JNZXNzYWdlXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0MmJhc2ljKG9yaWdpbjogTWVzc2FnZUZyb20pOiBCYXNpY01lc3NhZ2VGcm9tIHtcbiAgICBsZXQgcmV0OiBCYXNpY01lc3NhZ2VGcm9tID0ge1xuICAgICAgICBjb250ZW50OiBvcmlnaW4uY29udGVudCxcbiAgICAgICAgdHM6IG9yaWdpbi50c1xuICAgIH07XG4gICAgaWYgKG9yaWdpbi5yZW1hcmsgIT0gbnVsbCkge1xuICAgICAgICByZXQucmVtYXJrID0gb3JpZ2luLnJlbWFyaztcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHtcbiAgICBjb252ZXJ0MmJhc2ljLFxuICAgIFBhcnJvdEVycm9yXG59Il19
