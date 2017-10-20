(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var axios_1 = require("axios");
    var AttachmentBuilderImpl = (function () {
        function AttachmentBuilderImpl(apiOptions, attachment) {
            this.apiOptions = apiOptions;
            this.attachment = attachment;
        }
        AttachmentBuilderImpl.prototype.ok = function (callback) {
            var data = new FormData();
            data.append("attachment", this.attachment);
            var url = this.apiOptions.server + "/attachment";
            var header = {};
            for (var k in this.apiOptions.headers) {
                if (k.toLowerCase() !== "content-type") {
                    header[k] = this.apiOptions.headers[k];
                }
            }
            axios_1.default.post(url, data, { headers: header })
                .then(function (response) {
                return response.data;
            })
                .then(function (result) {
                if (callback) {
                    callback(null, result);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
        };
        return AttachmentBuilderImpl;
    }());
    exports.AttachmentBuilderImpl = AttachmentBuilderImpl;
});
