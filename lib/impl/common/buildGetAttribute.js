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
    var GetAttributesBuilderImpl = (function () {
        function GetAttributesBuilderImpl(common, id, attr) {
            this.common = common;
            this.id = id;
            this.attr = attr;
        }
        GetAttributesBuilderImpl.prototype.forUser = function (callback) {
            if (!callback) {
                return;
            }
            this.forAttr("/ctx/" + this.id, callback);
        };
        GetAttributesBuilderImpl.prototype.forGroup = function (callback) {
            if (!callback) {
                return;
            }
            this.forAttr("/groups/" + this.id, callback);
        };
        GetAttributesBuilderImpl.prototype.forRoom = function (callback) {
            if (!callback) {
                return;
            }
            this.forAttr("/rooms/" + this.id, callback);
        };
        GetAttributesBuilderImpl.prototype.forAttr = function (path, callback) {
            var url = "" + this.common.options().server + path + "/attributes";
            if (this.attr) {
                url += "/" + this.attr;
            }
            axios_1.default.get(url, { headers: this.common.options().headers })
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
        return GetAttributesBuilderImpl;
    }());
    exports.GetAttributesBuilderImpl = GetAttributesBuilderImpl;
});
