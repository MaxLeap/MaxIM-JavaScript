define(["require", "exports"], function (require, exports) {
    "use strict";
    var AttributeBuilderImpl = (function () {
        function AttributeBuilderImpl(admin, attributes, overwrite) {
            this.admin = admin;
            this.attributes = attributes;
            this.overwrite = overwrite || false;
        }
        AttributeBuilderImpl.prototype.forUser = function (userid, callback) {
            return this.process("/ctx/" + userid + "/attributes", callback);
        };
        AttributeBuilderImpl.prototype.forGroup = function (groupid, callback) {
            return this.process("/groups/" + groupid + "/attributes", callback);
        };
        AttributeBuilderImpl.prototype.forRoom = function (roomid, callback) {
            return this.process("/rooms/" + roomid + "/attributes", callback);
        };
        AttributeBuilderImpl.prototype.process = function (path, callback) {
            var url = "" + this.admin.options().server + path;
            var postData = JSON.stringify(this.attributes);
            var cfg = { headers: this.admin.options().headers };
            (this.overwrite ? axios.put(url, postData, cfg) : axios.post(url, postData, cfg))
                .then(function (ignore) {
                if (callback) {
                    callback(null, null);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return AttributeBuilderImpl;
    }());
    exports.AttributeBuilderImpl = AttributeBuilderImpl;
});

//# sourceMappingURL=buildAttribute.js.map
