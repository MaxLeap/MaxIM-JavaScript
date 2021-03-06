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
    var TalkingBuilderImpl = (function () {
        function TalkingBuilderImpl(context, ts, size, you, apiOptions) {
            this.ts = ts;
            this.size = size;
            this.context = context;
            this.you = you;
            this.apiOptions = apiOptions;
        }
        TalkingBuilderImpl.prototype.ofFriend = function (friendid, callback) {
            if (!callback) {
                return this.context;
            }
            return this.listHistories("/ctx/" + this.you + "/friends/" + friendid + "/chats", callback);
        };
        TalkingBuilderImpl.prototype.ofGroup = function (groupid, callback) {
            if (!callback) {
                return this.context;
            }
            return this.listHistories("/groups/" + groupid + "/chats", callback);
        };
        TalkingBuilderImpl.prototype.ofStranger = function (strangerid, callback) {
            if (!callback) {
                return this.context;
            }
            return this.listHistories("/ctx/" + this.you + "/strangers/" + strangerid + "/chats", callback);
        };
        TalkingBuilderImpl.prototype.ofPassenger = function (passengerid, callback) {
            if (!callback) {
                return this.context;
            }
            return this.listHistories("/passengers/" + passengerid + "/chats/" + this.you, callback);
        };
        TalkingBuilderImpl.prototype.listHistories = function (path, callback) {
            var url = "" + this.apiOptions.server + path;
            var q = [];
            if (this.ts > 0) {
                q.push("ts=" + this.ts);
            }
            if (this.size > 0) {
                q.push("limit=" + this.size);
            }
            if (q.length > 0) {
                url += "?" + q.join("&");
            }
            axios_1.default.get(url, { headers: this.apiOptions.headers })
                .then(function (response) {
                return response.data;
            })
                .then(function (records) {
                if (callback) {
                    callback(null, records);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.context;
        };
        return TalkingBuilderImpl;
    }());
    exports.TalkingBuilderImpl = TalkingBuilderImpl;
});
