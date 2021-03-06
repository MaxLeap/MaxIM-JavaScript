(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./buildAttachment", "./buildGetAttribute", "./buildLoad", "./buildSearch"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var buildAttachment_1 = require("./buildAttachment");
    var buildGetAttribute_1 = require("./buildGetAttribute");
    var buildLoad_1 = require("./buildLoad");
    var buildSearch_1 = require("./buildSearch");
    var CommonServiceImpl = (function () {
        function CommonServiceImpl(apiOptions) {
            this.opts = apiOptions;
        }
        CommonServiceImpl.prototype.options = function () {
            return this.opts;
        };
        CommonServiceImpl.prototype.search = function (query, skip, limit, sort) {
            return new buildSearch_1.SearchBuilderImpl(this.opts, {
                limit: limit,
                skip: skip,
                query: query,
                sort: sort,
            });
        };
        CommonServiceImpl.prototype.load = function (id) {
            return new buildLoad_1.LoadBuilderImpl(this.opts, {
                id: id,
            });
        };
        CommonServiceImpl.prototype.getAttributes = function (id, attributeName) {
            return new buildGetAttribute_1.GetAttributesBuilderImpl(this, id, attributeName);
        };
        CommonServiceImpl.prototype.attachment = function (attachment) {
            return new buildAttachment_1.AttachmentBuilderImpl(this.opts, attachment);
        };
        return CommonServiceImpl;
    }());
    exports.CommonServiceImpl = CommonServiceImpl;
});
