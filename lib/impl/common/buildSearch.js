var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "axios", "./builder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var axios_1 = require("axios");
    var builder_1 = require("./builder");
    var SearchBuilderImpl = (function (_super) {
        __extends(SearchBuilderImpl, _super);
        function SearchBuilderImpl() {
            return _super !== null && _super.apply(this, arguments) || this;
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
            axios_1.default.get(url, { headers: this.apiOptions.headers })
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
