"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var axios = require("axios");
var builder_1 = require("./builder");
var LoadBuilderImpl = (function (_super) {
    __extends(LoadBuilderImpl, _super);
    function LoadBuilderImpl() {
        _super.apply(this, arguments);
    }
    LoadBuilderImpl.prototype.forUser = function (callback) {
        this.forSomething("/ctx", callback);
    };
    LoadBuilderImpl.prototype.forGroup = function (callback) {
        this.forSomething("/groups", callback);
    };
    LoadBuilderImpl.prototype.forRoom = function (callback) {
        this.forSomething("/rooms", callback);
    };
    LoadBuilderImpl.prototype.forPassenger = function (callback) {
        this.forSomething("/passengers", callback);
    };
    LoadBuilderImpl.prototype.forSomething = function (path, callback) {
        var url = "" + this.apiOptions.server + path + "/" + this.extOptions.id;
        axios.post(url, null, { headers: this.apiOptions.headers })
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
    return LoadBuilderImpl;
}(builder_1.Builder));
exports.LoadBuilderImpl = LoadBuilderImpl;

//# sourceMappingURL=buildLoad.js.map
