"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var builder_1 = require("./builder");
var LoadBuilderImpl = (function (_super) {
    __extends(LoadBuilderImpl, _super);
    function LoadBuilderImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
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
        axios_1.default.post(url, null, { headers: this.apiOptions.headers })
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
