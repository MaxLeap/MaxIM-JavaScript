define(["require", "exports", "axios"], function (require, exports, axios) {
    "use strict";
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
            axios.get(url, { headers: this.common.options().headers })
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

//# sourceMappingURL=buildGetAttribute.js.map
