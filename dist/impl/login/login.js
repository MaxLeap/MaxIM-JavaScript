define(["require", "exports", "../../helper/md5", "../session/buildSession"], function (require, exports, md5_1, buildSession_1) {
    "use strict";
    function extend(target, source) {
        for (var k in source) {
            if ((typeof k) === "string") {
                target[k] = source[k];
            }
        }
    }
    var LoginImpl = (function () {
        function LoginImpl(apiOptions) {
            this.options = apiOptions;
            var foo = new Date().getTime();
            var bar = md5_1.md5("" + foo + this.options.sign) + "," + foo;
            this.basicAuth = {
                app: this.options.app,
                sign: bar,
            };
        }
        LoginImpl.prototype.simple = function (userid) {
            var authdata = {
                client: userid,
            };
            extend(authdata, this.basicAuth);
            return new buildSession_1.SessionBuilderImpl(this.options, authdata);
        };
        LoginImpl.prototype.byMaxleapUser = function (username, password) {
            var authdata = {
                username: username,
                password: password,
            };
            extend(authdata, this.basicAuth);
            return new buildSession_1.SessionBuilderImpl(this.options, authdata);
        };
        LoginImpl.prototype.byPhone = function (phone, verify) {
            var authdata = {
                phone: phone,
                password: verify,
            };
            extend(authdata, this.basicAuth);
            return new buildSession_1.SessionBuilderImpl(this.options, authdata);
        };
        return LoginImpl;
    }());
    exports.LoginImpl = LoginImpl;
});

//# sourceMappingURL=login.js.map
