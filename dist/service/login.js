(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./session", "../helper/md5"], factory);
    }
})(function (require, exports) {
    "use strict";
    var session_1 = require("./session");
    var md5_1 = require("../helper/md5");
    /**
     * 登录器实现类
     */
    var LoginImpl = (function () {
        function LoginImpl(apiOptions) {
            this._options = apiOptions;
            var foo = new Date().getTime();
            var bar = md5_1.md5("" + foo + this._options.sign) + ',' + foo;
            this._basicAuth = {
                app: this._options.app,
                sign: bar
            };
        }
        LoginImpl._extend = function (target, source) {
            for (var k in source) {
                target[k] = source[k];
            }
        };
        LoginImpl.prototype.simple = function (userid) {
            var authdata = {
                client: userid
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byMaxleapUser = function (username, password) {
            var authdata = {
                username: username,
                password: password
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byPhone = function (phone, verify) {
            var authdata = {
                phone: phone,
                password: verify
            };
            LoginImpl._extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        return LoginImpl;
    }());
    exports.LoginImpl = LoginImpl;
});