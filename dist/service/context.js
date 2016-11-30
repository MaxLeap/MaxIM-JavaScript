"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var common_1 = require("./common");
var fetch = require("isomorphic-fetch");
var utils_1 = require("../helper/utils");
var TalkingBuilderImpl = (function () {
    function TalkingBuilderImpl(context, ts, size, you, apiOptions) {
        this.ts = ts;
        this.size = size;
        this.context = context;
        this.you = you;
        this.apiOptions = apiOptions;
    }
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
            url += '?' + q.join('&');
        }
        var opts = {
            headers: this.apiOptions.headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
                callback(null, res[1]);
            }
        })
            .catch(function (e) {
            if (callback) {
                callback(e);
            }
        });
        return this.context;
    };
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
    return TalkingBuilderImpl;
}());
var ContextImpl = (function (_super) {
    __extends(ContextImpl, _super);
    function ContextImpl(apiOptions, you) {
        _super.call(this, apiOptions);
        this.you = you;
    }
    ContextImpl.prototype.listSomething = function (path, callback) {
        var url = "" + _super.prototype.options.call(this).server + path;
        var opts = {
            headers: _super.prototype.options.call(this).headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
                callback(null, res[1]);
            }
        })
            .catch(function (e) {
            if (callback) {
                callback(e);
            }
        });
        return this;
    };
    ContextImpl.prototype.listFriends = function (callback) {
        if (!callback) {
            return this;
        }
        var path = "/ctx/" + this.you + "/friends?detail";
        return this.listSomething(path, callback);
    };
    ContextImpl.prototype.listGroups = function (callback) {
        if (!callback) {
            return this;
        }
        var path = "/ctx/" + this.you + "/groups?detail";
        return this.listSomething(path, callback);
    };
    ContextImpl.prototype.listRooms = function (callback) {
        if (!callback) {
            return this;
        }
        var path = "/ctx/" + this.you + "/rooms?detail";
        return this.listSomething(path, callback);
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
        var opts = {
            method: 'POST',
            headers: _super.prototype.options.call(this).headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
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
        var opts = {
            method: 'POST',
            headers: _super.prototype.options.call(this).headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
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
        var opts = {
            method: 'POST',
            headers: _super.prototype.options.call(this).headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
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
        return new TalkingBuilderImpl(this, endTimestamp || 0, size || 0, this.you, _super.prototype.options.call(this));
    };
    ContextImpl.prototype.deleteSomething = function (path, callback) {
        var url = "" + _super.prototype.options.call(this).server + path;
        var opts = {
            method: 'DELETE',
            headers: _super.prototype.options.call(this).headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
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
        var opts = {
            method: overwrite ? 'PUT' : 'POST',
            body: JSON.stringify(attributes),
            headers: this.options().headers
        };
        fetch(url, opts)
            .then(function (response) {
            return response.json().then(function (result) { return [response.ok, result]; });
        })
            .then(function (res) {
            if (!res[0]) {
                throw new utils_1.ParrotError(res[1]);
            }
            else if (callback) {
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
    return ContextImpl;
}(common_1.CommonServiceImpl));
exports.ContextImpl = ContextImpl;
