define(["require", "exports"], function (require, exports) {
    "use strict";
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
            var path = "/ctx/" + this.you + "/friends/" + friendid + "/chats";
            return this.listHistories(path, callback);
        };
        TalkingBuilderImpl.prototype.ofGroup = function (groupid, callback) {
            if (!callback) {
                return this.context;
            }
            var path = "/groups/" + groupid + "/chats";
            return this.listHistories(path, callback);
        };
        TalkingBuilderImpl.prototype.ofStranger = function (strangerid, callback) {
            if (!callback) {
                return this.context;
            }
            var path = "/ctx/" + this.you + "/strangers/" + strangerid + "/chats";
            return this.listHistories(path, callback);
        };
        TalkingBuilderImpl.prototype.ofPassenger = function (passengerid, callback) {
            if (!callback) {
                return this.context;
            }
            var path = "/passengers/" + passengerid + "/chats/" + this.you;
            return this.listHistories(path, callback);
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
            axios.get(url, { headers: this.apiOptions.headers })
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

//# sourceMappingURL=talkingbuilder.js.map
