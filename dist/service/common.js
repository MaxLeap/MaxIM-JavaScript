var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'axios'], factory);
    }
})(function (require, exports) {
    "use strict";
    var axios = require('axios');
    var AttachmentBuilderImpl = (function () {
        function AttachmentBuilderImpl(apiOptions, attachment) {
            this.apiOptions = apiOptions;
            this.attachment = attachment;
        }
        AttachmentBuilderImpl.prototype.ok = function (callback) {
            var data = new FormData();
            data.append('attachment', this.attachment);
            var url = this.apiOptions.server + "/attachment";
            var header = {};
            for (var k in this.apiOptions.headers) {
                if (k.toLowerCase() !== 'content-type') {
                    header[k] = this.apiOptions.headers[k];
                }
            }
            axios.post(url, data, { headers: header })
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
        return AttachmentBuilderImpl;
    }());
    var GetAttributesBuilderImpl = (function () {
        function GetAttributesBuilderImpl(common, id, attr) {
            this.common = common;
            this.id = id;
            this.attr = attr;
        }
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
        return GetAttributesBuilderImpl;
    }());
    var Builder = (function () {
        function Builder(apiOptions, extOptions) {
            this.apiOptions = apiOptions;
            this.extOptions = extOptions;
        }
        return Builder;
    }());
    var LoadBuilderImpl = (function (_super) {
        __extends(LoadBuilderImpl, _super);
        function LoadBuilderImpl() {
            _super.apply(this, arguments);
        }
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
        LoadBuilderImpl.prototype.forUser = function (callback) {
            this.forSomething('/ctx', callback);
        };
        LoadBuilderImpl.prototype.forGroup = function (callback) {
            this.forSomething('/groups', callback);
        };
        LoadBuilderImpl.prototype.forRoom = function (callback) {
            this.forSomething('/rooms', callback);
        };
        LoadBuilderImpl.prototype.forPassenger = function (callback) {
            this.forSomething('/passengers', callback);
        };
        return LoadBuilderImpl;
    }(Builder));
    var SearchBuilderImpl = (function (_super) {
        __extends(SearchBuilderImpl, _super);
        function SearchBuilderImpl() {
            _super.apply(this, arguments);
        }
        SearchBuilderImpl.prototype.getUrl = function (path) {
            var q = [];
            for (var k in this.extOptions.query) {
                var v = this.extOptions.query[k];
                q.push(k + "=" + v);
            }
            q.push("_skip=" + (this.extOptions.skip || 0));
            q.push("_limit=" + (this.extOptions.limit || 20));
            return "" + this.apiOptions.server + path + "?" + q.join('&');
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
        SearchBuilderImpl.prototype.forUsers = function (callback) {
            this.forSomething('/ctx', callback);
        };
        SearchBuilderImpl.prototype.forGroups = function (callback) {
            this.forSomething('/groups', callback);
        };
        SearchBuilderImpl.prototype.forRooms = function (callback) {
            this.forSomething('/rooms', callback);
        };
        return SearchBuilderImpl;
    }(Builder));
    var CommonServiceImpl = (function () {
        function CommonServiceImpl(apiOptions) {
            this._options = apiOptions;
        }
        CommonServiceImpl.prototype.options = function () {
            return this._options;
        };
        CommonServiceImpl.prototype.search = function (query, skip, limit, sort) {
            var searchOptions = {
                limit: limit,
                skip: skip,
                query: query,
                sort: sort
            };
            return new SearchBuilderImpl(this._options, searchOptions);
        };
        CommonServiceImpl.prototype.load = function (id) {
            var opts = {
                id: id
            };
            return new LoadBuilderImpl(this._options, opts);
        };
        CommonServiceImpl.prototype.getAttributes = function (id, attributeName) {
            return new GetAttributesBuilderImpl(this, id, attributeName);
        };
        CommonServiceImpl.prototype.attachment = function (attachment) {
            return new AttachmentBuilderImpl(this._options, attachment);
        };
        return CommonServiceImpl;
    }());
    exports.CommonServiceImpl = CommonServiceImpl;
});
