var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "axios", "./builder"], function (require, exports, axios, builder_1) {
    "use strict";
    var SearchBuilderImpl = (function (_super) {
        __extends(SearchBuilderImpl, _super);
        function SearchBuilderImpl() {
            _super.apply(this, arguments);
        }
        SearchBuilderImpl.prototype.forUsers = function (callback) {
            this.forSomething("/ctx", callback);
        };
        SearchBuilderImpl.prototype.forGroups = function (callback) {
            this.forSomething("/groups", callback);
        };
        SearchBuilderImpl.prototype.forRooms = function (callback) {
            this.forSomething("/rooms", callback);
        };
        SearchBuilderImpl.prototype.getUrl = function (path) {
            var q = [];
            for (var k in this.extOptions.query) {
                var v = this.extOptions.query[k];
                q.push(k + "=" + v);
            }
            q.push("_skip=" + (this.extOptions.skip || 0));
            q.push("_limit=" + (this.extOptions.limit || 20));
            return "" + this.apiOptions.server + path + "?" + q.join("&");
        };
        SearchBuilderImpl.prototype.forSomething = function (path, callback) {
            var url = this.getUrl(path);
            axios.get(url, { headers: this.apiOptions.headers })
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
        return SearchBuilderImpl;
    }(builder_1.Builder));
    exports.SearchBuilderImpl = SearchBuilderImpl;
});

//# sourceMappingURL=buildSearch.js.map
