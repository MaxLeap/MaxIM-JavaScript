(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var APIOptions = (function () {
        function APIOptions(server, app, sign) {
            this.server = server;
            this.app = app;
            this.sign = sign;
            this.headers = {
                'x-ml-appid': app,
                'x-ml-apikey': sign,
                'content-type': 'application/json; charset=utf-8'
            };
        }
        return APIOptions;
    }());
    exports.APIOptions = APIOptions;
});
