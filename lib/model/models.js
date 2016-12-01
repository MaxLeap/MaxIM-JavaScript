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

//# sourceMappingURL=models.js.map
