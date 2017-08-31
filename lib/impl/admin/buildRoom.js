"use strict";
var RoomBuilderImpl = (function () {
    function RoomBuilderImpl(admin) {
        this.admin = admin;
        this.attributes = {};
        this.appends = [];
    }
    RoomBuilderImpl.prototype.members = function (first) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        this.appends.push(first);
        if (others) {
            for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
                var s = others_1[_a];
                this.appends.push(s);
            }
        }
        return this;
    };
    RoomBuilderImpl.prototype.attribute = function (key, value) {
        this.attributes[key] = value;
        return this;
    };
    RoomBuilderImpl.prototype.ok = function (callback) {
        var _this = this;
        var op = this.admin.options();
        var url = op.server + "/rooms";
        var body = {
            members: this.appends,
        };
        var config = { headers: op.headers };
        axios.post(url, JSON.stringify(body), config)
            .then(function (response) {
            return response.data;
        })
            .then(function (roomid) {
            var url2 = op.server + "/rooms/" + roomid + "/attributes";
            var postData = JSON.stringify(_this.attributes);
            return axios.post(url2, postData, { headers: op.headers })
                .then(function (ignore) {
                return roomid;
            });
        })
            .then(function (roomid) {
            if (callback) {
                callback(null, roomid);
            }
        })
            .catch(function (e) {
            if (callback) {
                callback(e);
            }
        });
        return this.admin;
    };
    return RoomBuilderImpl;
}());
exports.RoomBuilderImpl = RoomBuilderImpl;

//# sourceMappingURL=buildRoom.js.map
