(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./service/admin", "./service/login", "./model/models", "./service/passenger"], factory);
    }
})(function (require, exports) {
    "use strict";
    var admin_1 = require("./service/admin");
    var login_1 = require("./service/login");
    var models_1 = require("./model/models");
    var passenger_1 = require("./service/passenger");
    var MaxIMImpl = (function () {
        function MaxIMImpl(options) {
            if (!options || !options.app || !options.key) {
                throw new Error("invalid options: " + JSON.stringify(options));
            }
            var server, protocol = options.useHttp ? 'http://' : 'https://';
            switch ((options.region || 'cn').toLowerCase()) {
                case 'us':
                    server = 'im.maxleap.com';
                    break;
                case 'cn':
                    server = 'im.maxleap.cn';
                    break;
                case 'test':
                    server = 'imuat.maxleap.cn';
                    break;
                default:
                    throw new Error("invalid region " + options.region);
            }
            this._options = new models_1.APIOptions("" + protocol + server, options.app, options.key);
            this._admin = new admin_1.AdminImpl(this._options);
        }
        MaxIMImpl.prototype.login = function () {
            return new login_1.LoginImpl(this._options);
        };
        MaxIMImpl.prototype.passenger = function (id) {
            return new passenger_1.PassengerBuilderImpl(this._options, id);
        };
        MaxIMImpl.prototype.admin = function () {
            return this._admin;
        };
        return MaxIMImpl;
    }());
    if (typeof window !== 'undefined') {
        var ml = 'ML', im = 'im';
        if (typeof window[ml] === 'undefined') {
            window[ml] = {};
        }
        window[ml][im] = function (options) {
            return new MaxIMImpl(options);
        };
    }
    return function (options) { return new MaxIMImpl(options); };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFBQSxzQkFBK0IsaUJBQWlCLENBQUMsQ0FBQTtJQUNqRCxzQkFBK0IsaUJBQWlCLENBQUMsQ0FBQTtJQUNqRCx1QkFBeUIsZ0JBQWdCLENBQUMsQ0FBQTtJQUMxQywwQkFBcUQscUJBQXFCLENBQUMsQ0FBQTtJQXlCM0U7UUFLSSxtQkFBWSxPQUFxQjtZQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUcsQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFFRCxJQUFJLE1BQWMsRUFBRSxRQUFRLEdBQVcsT0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQ2hGLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLEtBQUssSUFBSTtvQkFDTCxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7b0JBQzFCLEtBQUssQ0FBQztnQkFDVixLQUFLLElBQUk7b0JBQ0wsTUFBTSxHQUFHLGVBQWUsQ0FBQztvQkFDekIsS0FBSyxDQUFDO2dCQUNWLEtBQUssTUFBTTtvQkFDUCxNQUFNLEdBQUcsa0JBQWtCLENBQUM7b0JBQzVCLEtBQUssQ0FBQztnQkFDVjtvQkFDSSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFrQixPQUFPLENBQUMsTUFBUSxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUcsUUFBUSxHQUFHLE1BQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksaUJBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELHlCQUFLLEdBQUw7WUFDSSxNQUFNLENBQUMsSUFBSSxpQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsNkJBQVMsR0FBVCxVQUFVLEVBQVc7WUFDakIsTUFBTSxDQUFDLElBQUksZ0NBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBRUQseUJBQUssR0FBTDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7UUFDTCxnQkFBQztJQUFELENBdkNBLEFBdUNDLElBQUE7SUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsT0FBcUI7WUFDNUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFTLFVBQUMsT0FBcUIsSUFBWSxPQUFBLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUF0QixDQUFzQixDQUFDIiwiZmlsZSI6ImltLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZG1pbiwgQWRtaW5JbXBsfSBmcm9tIFwiLi9zZXJ2aWNlL2FkbWluXCI7XG5pbXBvcnQge0xvZ2luLCBMb2dpbkltcGx9IGZyb20gXCIuL3NlcnZpY2UvbG9naW5cIjtcbmltcG9ydCB7QVBJT3B0aW9uc30gZnJvbSBcIi4vbW9kZWwvbW9kZWxzXCI7XG5pbXBvcnQge1Bhc3NlbmdlckJ1aWxkZXIsIFBhc3NlbmdlckJ1aWxkZXJJbXBsfSBmcm9tIFwiLi9zZXJ2aWNlL3Bhc3NlbmdlclwiO1xuXG5pbnRlcmZhY2UgTWF4SU1PcHRpb25zIHtcbiAgICBhcHA6IHN0cmluZztcbiAgICBrZXk6IHN0cmluZztcbiAgICByZWdpb24/OiBzdHJpbmc7XG4gICAgdXNlSHR0cD86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBNYXhJTSB7XG4gICAgLyoqXG4gICAgICog55m75b2VXG4gICAgICovXG4gICAgbG9naW4oKTogTG9naW47XG4gICAgLyoqXG4gICAgICog6K6/5a6i55m75b2VXG4gICAgICogQHBhcmFtIGlkIOiuv+WuoklEXG4gICAgICovXG4gICAgcGFzc2VuZ2VyKGlkPzogc3RyaW5nKTogUGFzc2VuZ2VyQnVpbGRlcjtcbiAgICAvKipcbiAgICAgKiDojrflj5bnrqHnkIbmjqXlj6NcbiAgICAgKi9cbiAgICBhZG1pbigpOiBBZG1pbjtcbn1cblxuY2xhc3MgTWF4SU1JbXBsIGltcGxlbWVudHMgTWF4SU0ge1xuXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogQVBJT3B0aW9ucztcbiAgICBwcml2YXRlIF9hZG1pbjogQWRtaW47XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBNYXhJTU9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmFwcCB8fCAhb3B0aW9ucy5rZXkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBvcHRpb25zOiAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlcnZlcjogc3RyaW5nLCBwcm90b2NvbDogc3RyaW5nID0gb3B0aW9ucy51c2VIdHRwID8gJ2h0dHA6Ly8nIDogJ2h0dHBzOi8vJztcbiAgICAgICAgc3dpdGNoICgob3B0aW9ucy5yZWdpb24gfHwgJ2NuJykudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSAndXMnOlxuICAgICAgICAgICAgICAgIHNlcnZlciA9ICdpbS5tYXhsZWFwLmNvbSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjbic6XG4gICAgICAgICAgICAgICAgc2VydmVyID0gJ2ltLm1heGxlYXAuY24nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGVzdCc6XG4gICAgICAgICAgICAgICAgc2VydmVyID0gJ2ltdWF0Lm1heGxlYXAuY24nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgcmVnaW9uICR7b3B0aW9ucy5yZWdpb259YCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG5ldyBBUElPcHRpb25zKGAke3Byb3RvY29sfSR7c2VydmVyfWAsIG9wdGlvbnMuYXBwLCBvcHRpb25zLmtleSk7XG4gICAgICAgIHRoaXMuX2FkbWluID0gbmV3IEFkbWluSW1wbCh0aGlzLl9vcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb2dpbigpOiBMb2dpbiB7XG4gICAgICAgIHJldHVybiBuZXcgTG9naW5JbXBsKHRoaXMuX29wdGlvbnMpO1xuICAgIH1cblxuICAgIHBhc3NlbmdlcihpZD86IHN0cmluZyk6IFBhc3NlbmdlckJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IFBhc3NlbmdlckJ1aWxkZXJJbXBsKHRoaXMuX29wdGlvbnMsIGlkKTtcbiAgICB9XG5cbiAgICBhZG1pbigpOiBBZG1pbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZG1pbjtcbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGxldCBtbCA9ICdNTCcsIGltID0gJ2ltJztcbiAgICBpZiAodHlwZW9mIHdpbmRvd1ttbF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvd1ttbF0gPSB7fTtcbiAgICB9XG4gICAgd2luZG93W21sXVtpbV0gPSBmdW5jdGlvbiAob3B0aW9uczogTWF4SU1PcHRpb25zKTogTWF4SU0ge1xuICAgICAgICByZXR1cm4gbmV3IE1heElNSW1wbChvcHRpb25zKVxuICAgIH07XG59XG5cbmV4cG9ydCA9IChvcHRpb25zOiBNYXhJTU9wdGlvbnMpOiBNYXhJTSA9PiBuZXcgTWF4SU1JbXBsKG9wdGlvbnMpOyJdfQ==
