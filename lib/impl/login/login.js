"use strict";
var md5_1 = require("../../helper/md5");
var buildSession_1 = require("../session/buildSession");
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
    LoginImpl.extend = function (target, source) {
        for (var k in source) {
            target[k] = source[k];
        }
    };
    LoginImpl.prototype.simple = function (userid) {
        var authdata = {
            client: userid,
        };
        LoginImpl.extend(authdata, this.basicAuth);
        return new buildSession_1.SessionBuilderImpl(this.options, authdata);
    };
    LoginImpl.prototype.byMaxleapUser = function (username, password) {
        var authdata = {
            username: username,
            password: password,
        };
        LoginImpl.extend(authdata, this.basicAuth);
        return new buildSession_1.SessionBuilderImpl(this.options, authdata);
    };
    LoginImpl.prototype.byPhone = function (phone, verify) {
        var authdata = {
            phone: phone,
            password: verify,
        };
        LoginImpl.extend(authdata, this.basicAuth);
        return new buildSession_1.SessionBuilderImpl(this.options, authdata);
    };
    return LoginImpl;
}());
exports.LoginImpl = LoginImpl;

//# sourceMappingURL=login.js.map
