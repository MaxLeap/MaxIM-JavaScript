"use strict";
var axios = require("axios");
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
        axios.post(url, data, { headers: header })
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

//# sourceMappingURL=buildAttachment.js.map
