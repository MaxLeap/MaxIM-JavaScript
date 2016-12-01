define(["require", "exports", "./service/admin", "./service/login", "./model/models", "./service/passenger"], function (require, exports, admin_1, login_1, models_1, passenger_1) {
    "use strict";
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

//# sourceMappingURL=im.js.map
