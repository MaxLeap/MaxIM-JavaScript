"use strict";
var admin_1 = require("./impl/admin/admin");
var login_1 = require("./impl/login/login");
var passenger_1 = require("./impl/passenger/passenger");
var models_1 = require("./model/models");
var MaxIMImpl = (function () {
    function MaxIMImpl(options) {
        if (!options || !options.app || !options.key) {
            throw new Error("invalid options: " + JSON.stringify(options) + ".");
        }
        var server;
        var protocol = options.useHttp ? "http://" : "https://";
        switch ((options.region || "cn").toLowerCase()) {
            case "us":
                server = "im.maxleap.com";
                break;
            case "cn":
                server = "im.maxleap.cn";
                break;
            case "test":
                server = "imuat.maxleap.cn";
                break;
            default:
                throw new Error("invalid region " + options.region + ".");
        }
        this.currentOptions = new models_1.APIOptions("" + protocol + server, options.app, options.key);
        this.currentAdmin = new admin_1.AdminImpl(this.currentOptions);
    }
    MaxIMImpl.prototype.login = function () {
        return new login_1.LoginImpl(this.currentOptions);
    };
    MaxIMImpl.prototype.passenger = function (id) {
        return new passenger_1.PassengerBuilderImpl(this.currentOptions, id);
    };
    MaxIMImpl.prototype.admin = function () {
        return this.currentAdmin;
    };
    return MaxIMImpl;
}());
if (typeof window !== "undefined") {
    var ml = "ML";
    var im = "im";
    if (typeof window[ml] === "undefined") {
        window[ml] = {};
    }
    window[ml][im] = function (options) {
        return new MaxIMImpl(options);
    };
}
module.exports = function (options) { return new MaxIMImpl(options); };

//# sourceMappingURL=im.js.map
