define(["require", "exports"], function (require, exports) {
    "use strict";
    var GroupBuilderImpl = (function () {
        function GroupBuilderImpl(admin, owner) {
            this.admin = admin;
            this.appends = [];
            this.owner = owner;
        }
        GroupBuilderImpl.prototype.attribute = function (key, value) {
            if (!this.attributes) {
                this.attributes = {};
            }
            this.attributes[key] = value;
            return this;
        };
        GroupBuilderImpl.prototype.members = function (first, others) {
            this.appends.push(first);
            if (others && others.length > 0) {
                for (var _i = 0, others_1 = others; _i < others_1.length; _i++) {
                    var s = others_1[_i];
                    this.appends.push(s);
                }
            }
            return this;
        };
        GroupBuilderImpl.prototype.ok = function (callback) {
            var _this = this;
            var url = this.admin.options().server + "/groups";
            var data = {
                owner: this.owner,
                members: this.appends,
            };
            axios.post(url, JSON.stringify(data), { headers: this.admin.options().headers })
                .then(function (response) {
                return response.data;
            })
                .then(function (groupid) {
                _this.admin
                    .setAttributes(_this.attributes)
                    .forGroup(groupid, function (err) {
                    if (callback) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null, groupid);
                        }
                    }
                });
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return GroupBuilderImpl;
    }());
    exports.GroupBuilderImpl = GroupBuilderImpl;
});

//# sourceMappingURL=buildGroup.js.map
