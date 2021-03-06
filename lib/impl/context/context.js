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
        define(["require", "exports", "../common/common", "./talkingbuilder", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("../common/common");
    var talkingbuilder_1 = require("./talkingbuilder");
    var axios_1 = require("axios");
    var ContextImpl = (function (_super) {
        __extends(ContextImpl, _super);
        function ContextImpl(apiOptions, you) {
            var _this = _super.call(this, apiOptions) || this;
            _this.you = you;
            return _this;
        }
        ContextImpl.prototype.listFriends = function (callback) {
            if (!callback) {
                return this;
            }
            return this.listSomething("/ctx/" + this.you + "/friends?detail", callback);
        };
        ContextImpl.prototype.listGroups = function (callback) {
            if (!callback) {
                return this;
            }
            return this.listSomething("/ctx/" + this.you + "/groups?detail", callback);
        };
        ContextImpl.prototype.listRooms = function (callback) {
            if (!callback) {
                return this;
            }
            return this.listSomething("/ctx/" + this.you + "/rooms?detail", callback);
        };
        ContextImpl.prototype.listStrangers = function (callback, skip, limit) {
            if (!callback) {
                return this;
            }
            var path = "/ctx/" + this.you + "/strangers?detail";
            if (skip) {
                path += "&skip=" + skip;
            }
            if (limit) {
                path += "&limit=" + limit;
            }
            return this.listSomething(path, callback);
        };
        ContextImpl.prototype.joinFriend = function (userid, callback) {
            var url = _super.prototype.options.call(this).server + "/ctx/" + this.you + "/friends/" + userid;
            axios_1.default.post(url, null, { headers: _super.prototype.options.call(this).headers })
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
            return this;
        };
        ContextImpl.prototype.joinGroup = function (groupid, callback) {
            var url = _super.prototype.options.call(this).server + "/groups/" + groupid + "/members/" + this.you;
            axios_1.default.post(url, null, { headers: _super.prototype.options.call(this).headers })
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
            return this;
        };
        ContextImpl.prototype.joinRoom = function (roomid, callback) {
            var url = _super.prototype.options.call(this).server + "/rooms/" + roomid + "/members/" + this.you;
            axios_1.default.post(url, null, { headers: _super.prototype.options.call(this).headers })
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
            return this;
        };
        ContextImpl.prototype.listTalkings = function (endTimestamp, size) {
            return new talkingbuilder_1.TalkingBuilderImpl(this, endTimestamp || 0, size || 0, this.you, _super.prototype.options.call(this));
        };
        ContextImpl.prototype.leaveFriend = function (userid, callback) {
            var path = "/ctx/" + this.you + "/friends/" + userid;
            return this.deleteSomething(path, callback);
        };
        ContextImpl.prototype.leaveGroup = function (groupid, callback) {
            var path = "/groups/" + groupid + "/members/" + this.you;
            return this.deleteSomething(path, callback);
        };
        ContextImpl.prototype.leaveRoom = function (roomid, callback) {
            var path = "/rooms/" + roomid + "/members/" + this.you;
            return this.deleteSomething(path, callback);
        };
        ContextImpl.prototype.setMyAttributes = function (attributes, overwrite, callback) {
            var url = "/ctx/" + this.you + "/attributes";
            var postData = JSON.stringify(attributes);
            var cfg = { headers: this.options().headers };
            (overwrite ? axios_1.default.put(url, postData, cfg) : axios_1.default.post(url, postData, cfg))
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
            return this;
        };
        ContextImpl.prototype.setMyAttribute = function (name, value, callback) {
            var attributes = {};
            attributes[name] = value;
            return this.setMyAttributes(attributes, false, callback);
        };
        ContextImpl.prototype.getMyAttributes = function (callback) {
            if (callback) {
                _super.prototype.getAttributes.call(this, this.you).forUser(callback);
            }
            return this;
        };
        ContextImpl.prototype.getMyAttribute = function (attributeName, callback) {
            if (callback) {
                _super.prototype.getAttributes.call(this, this.you, attributeName).forUser(callback);
            }
            return this;
        };
        ContextImpl.prototype.listSomething = function (path, callback) {
            var url = "" + _super.prototype.options.call(this).server + path;
            axios_1.default.get(url, { headers: _super.prototype.options.call(this).headers })
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
            return this;
        };
        ContextImpl.prototype.deleteSomething = function (path, callback) {
            var url = "" + _super.prototype.options.call(this).server + path;
            axios_1.default.delete(url, { headers: _super.prototype.options.call(this).headers })
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
            return this;
        };
        return ContextImpl;
    }(common_1.CommonServiceImpl));
    exports.ContextImpl = ContextImpl;
});
