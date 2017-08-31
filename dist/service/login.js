define(["require", "exports", "./session", "../helper/md5"], function (require, exports, session_1, md5_1) {
    "use strict";
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
            LoginImpl.extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byMaxleapUser = function (username, password) {
            var authdata = {
                username: username,
                password: password
            };
            LoginImpl.extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        LoginImpl.prototype.byPhone = function (phone, verify) {
            var authdata = {
                phone: phone,
                password: verify
            };
            LoginImpl.extend(authdata, this._basicAuth);
            return new session_1.SessionBuilderImpl(this._options, authdata);
        };
        return LoginImpl;
    }());
    exports.LoginImpl = LoginImpl;
});

//# sourceMappingURL=login.js.map
