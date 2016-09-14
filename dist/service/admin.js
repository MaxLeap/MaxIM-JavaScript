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
        define(["require", "exports", "./common", "../model/messages", "isomorphic-fetch"], factory);
    }
})(function (require, exports) {
    "use strict";
    var common_1 = require("./common");
    var messages_1 = require("../model/messages");
    var fetch = require("isomorphic-fetch");
    var GroupDestroyImpl = (function () {
        function GroupDestroyImpl(admin, groupid) {
            this.admin = admin;
            this.groupid = groupid;
        }
        GroupDestroyImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/groups/" + this.groupid;
            var opts = {
                method: 'DELETE',
                headers: this.admin.options().headers
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return GroupDestroyImpl;
    }());
    var RoomDestroyImpl = (function () {
        function RoomDestroyImpl(admin, roomid) {
            this.admin = admin;
            this.roomid = roomid;
        }
        RoomDestroyImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/rooms/" + this.roomid;
            var opts = {
                method: 'DELETE',
                headers: this.admin.options().headers
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return RoomDestroyImpl;
    }());
    var DestroyCommandImpl = (function () {
        function DestroyCommandImpl(admin) {
            this.admin = admin;
        }
        DestroyCommandImpl.prototype.group = function (groupid) {
            return new GroupDestroyImpl(this.admin, groupid);
        };
        DestroyCommandImpl.prototype.room = function (roomid) {
            return new RoomDestroyImpl(this.admin, roomid);
        };
        return DestroyCommandImpl;
    }());
    var CreateCommandImpl = (function () {
        function CreateCommandImpl(admin) {
            this.admin = admin;
        }
        CreateCommandImpl.prototype.group = function (owner) {
            return new GroupBuilderImpl(this.admin, owner);
        };
        CreateCommandImpl.prototype.room = function () {
            return new RoomBuilderImpl(this.admin);
        };
        return CreateCommandImpl;
    }());
    var GroupBuilderImpl = (function () {
        function GroupBuilderImpl(admin, owner) {
            this.admin = admin;
            this.appends = [];
            this.owner = owner;
        }
        GroupBuilderImpl.prototype.attribute = function (key, value) {
            if (!this.attributes) {
                this.attributes = {};
            }
            this.attributes[key] = value;
            return this;
        };
        GroupBuilderImpl.prototype.members = function (first, others) {
            this.appends.push(first);
            if (others && others.length > 0) {
                for (var _i = 0, others_1 = others; _i < others_1.length; _i++) {
                    var s = others_1[_i];
                    this.appends.push(s);
                }
            }
            return this;
        };
        GroupBuilderImpl.prototype.ok = function (callback) {
            var _this = this;
            var op = this.admin.options();
            var url = op.server + "/groups";
            var data = {
                owner: this.owner,
                members: this.appends
            };
            var opts = {
                method: 'POST',
                headers: op.headers,
                body: JSON.stringify(data)
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    return response.json();
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .then(function (groupid) {
                _this.admin
                    .setAttributes(_this.attributes)
                    .forGroup(groupid, function (err) {
                    if (err && callback) {
                        callback(err);
                    }
                    else {
                        callback(null, groupid);
                    }
                });
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return GroupBuilderImpl;
    }());
    var MemberAppendCommandImpl = (function () {
        function MemberAppendCommandImpl(admin, members) {
            this.admin = admin;
            this.members = {
                members: members
            };
        }
        MemberAppendCommandImpl.prototype._append = function (path, callback) {
            var url = "" + this.admin.options().server + path + "/members";
            var opts = {
                method: 'POST',
                headers: this.admin.options().headers,
                body: JSON.stringify(this.members)
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        MemberAppendCommandImpl.prototype.intoRoom = function (roomid, callback) {
            return this._append("/rooms/" + roomid, callback);
        };
        MemberAppendCommandImpl.prototype.intoGroup = function (groupid, callback) {
            return this._append("/groups/" + groupid, callback);
        };
        return MemberAppendCommandImpl;
    }());
    var MemberRemoveCommandImpl = (function () {
        function MemberRemoveCommandImpl(admin, members) {
            this.admin = admin;
            this.members = {
                members: members
            };
        }
        MemberRemoveCommandImpl.prototype._delete = function (path, callback) {
            var op = this.admin.options();
            var url = "" + op.server + path + "/members";
            var opts = {
                method: 'DELETE',
                body: JSON.stringify(this.members),
                headers: op.headers
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        MemberRemoveCommandImpl.prototype.fromRoom = function (roomid, callback) {
            return this._delete("/rooms/" + roomid, callback);
        };
        MemberRemoveCommandImpl.prototype.fromGroup = function (groupid, callback) {
            return this._delete("/groups/" + groupid, callback);
        };
        return MemberRemoveCommandImpl;
    }());
    var MessageBuilderImpl = (function () {
        function MessageBuilderImpl(admin, text, remark) {
            this.admin = admin;
            this.message = {
                content: {
                    media: messages_1.Media.TEXT,
                    body: text
                }
            };
            if (remark !== undefined && remark !== null) {
                this.message.remark = remark;
            }
        }
        MessageBuilderImpl.prototype.touchPush = function () {
            if (!this.message.push) {
                this.message.push = {};
            }
            return this.message.push;
        };
        MessageBuilderImpl.prototype.disablePush = function () {
            this.touchPush().enable = false;
            return this;
        };
        MessageBuilderImpl.prototype.setPushSound = function (sound) {
            this.touchPush().sound = sound;
            return this;
        };
        MessageBuilderImpl.prototype.setPushBadge = function (badge) {
            this.touchPush().badge = badge;
            return this;
        };
        MessageBuilderImpl.prototype.setPushContentAvailable = function (contentAvailable) {
            this.touchPush().contentAvailable = contentAvailable;
            return this;
        };
        MessageBuilderImpl.prototype.setPushPrefix = function (prefix) {
            this.touchPush().prefix = prefix;
            return this;
        };
        MessageBuilderImpl.prototype.setPushSuffix = function (suffix) {
            this.touchPush().suffix = suffix;
            return this;
        };
        MessageBuilderImpl.prototype.setPushTextOverwrite = function (text) {
            this.touchPush().overwrite = text;
            return this;
        };
        MessageBuilderImpl.prototype.asText = function () {
            this.message.content.media = messages_1.Media.TEXT;
            return this;
        };
        MessageBuilderImpl.prototype.asImage = function () {
            this.message.content.media = messages_1.Media.IMAGE;
            return this;
        };
        MessageBuilderImpl.prototype.asAudio = function () {
            this.message.content.media = messages_1.Media.AUDIO;
            return undefined;
        };
        MessageBuilderImpl.prototype.asVideo = function () {
            this.message.content.media = messages_1.Media.VIDEO;
            return undefined;
        };
        MessageBuilderImpl.prototype.toAll = function () {
            this.receiver = {};
            return new MessageLanucherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toUser = function (userid) {
            this.receiver = {
                id: userid,
                type: messages_1.Receiver.ACTOR
            };
            return new MessageLanucherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toGroup = function (groupid) {
            this.receiver = {
                id: groupid,
                type: messages_1.Receiver.GROUP
            };
            return new MessageLanucherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toRoom = function (roomid) {
            this.receiver = {
                id: roomid,
                type: messages_1.Receiver.ROOM
            };
            return new MessageLanucherImpl(this.admin, this.message, this.receiver);
        };
        return MessageBuilderImpl;
    }());
    var MessageLanucherImpl = (function () {
        function MessageLanucherImpl(admin, message, receiver) {
            this.admin = admin;
            this.message = message;
            this.receiver = receiver;
        }
        MessageLanucherImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/system";
            if (this.receiver.id) {
                url += "/" + this.receiver.id;
                switch (this.receiver.type) {
                    case messages_1.Receiver.GROUP:
                        url += '?group';
                        break;
                    case messages_1.Receiver.ROOM:
                        url += '?room';
                        break;
                    default:
                        break;
                }
            }
            var opts = {
                method: 'POST',
                headers: this.admin.options().headers,
                body: JSON.stringify(this.message)
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        return MessageLanucherImpl;
    }());
    var AttributeBuilderImpl = (function () {
        function AttributeBuilderImpl(admin, attributes, overwrite) {
            this.admin = admin;
            this.attributes = attributes;
            this.overwrite = overwrite || false;
        }
        AttributeBuilderImpl.prototype.process = function (path, callback) {
            var url = "" + this.admin.options().server + path;
            var opts = {
                method: this.overwrite ? 'PUT' : 'POST',
                headers: this.admin.options().headers,
                body: JSON.stringify(this.attributes)
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    return response.json();
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .then(function () {
                if (callback) {
                    callback(null, null);
                }
            })
                .catch(function (e) {
                if (callback) {
                    callback(e);
                }
            });
            return this.admin;
        };
        AttributeBuilderImpl.prototype.forUser = function (userid, callback) {
            var path = "/ctx/" + userid + "/attributes";
            return this.process(path, callback);
        };
        AttributeBuilderImpl.prototype.forGroup = function (groupid, callback) {
            var path = "/groups/" + groupid + "/attributes";
            return this.process(path, callback);
        };
        AttributeBuilderImpl.prototype.forRoom = function (roomid, callback) {
            var path = "/rooms/" + roomid + "/attributes";
            return this.process(path, callback);
        };
        return AttributeBuilderImpl;
    }());
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
                for (var _a = 0, others_2 = others; _a < others_2.length; _a++) {
                    var s = others_2[_a];
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
                members: this.appends
            };
            var opts = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: op.headers
            };
            fetch(url, opts)
                .then(function (response) {
                if (common_1.successful(response)) {
                    return response.json();
                }
                else {
                    throw new Error("error: " + response.status);
                }
            })
                .then(function (roomid) {
                var url = op.server + "/rooms/" + roomid + "/attributes";
                var opts = {
                    method: 'POST',
                    body: JSON.stringify(_this.attributes),
                    headers: op.headers
                };
                return fetch(url, opts)
                    .then(function (response) {
                    if (common_1.successful(response)) {
                        return roomid;
                    }
                    else {
                        throw new Error("error : " + response.status);
                    }
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
    var AdminImpl = (function (_super) {
        __extends(AdminImpl, _super);
        function AdminImpl() {
            _super.apply(this, arguments);
        }
        AdminImpl.prototype.say = function (text, remark) {
            return new MessageBuilderImpl(this, text, remark);
        };
        AdminImpl.prototype.setAttributes = function (attributes, overwrite) {
            return new AttributeBuilderImpl(this, attributes, overwrite);
        };
        AdminImpl._concat = function (first) {
            var others = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                others[_i - 1] = arguments[_i];
            }
            var all = [];
            all.push(first);
            if (others && others.length > 0) {
                for (var _a = 0, others_3 = others; _a < others_3.length; _a++) {
                    var s = others_3[_a];
                    all.push(s);
                }
            }
            return all;
        };
        AdminImpl.prototype.removeMembers = function (first) {
            var others = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                others[_i - 1] = arguments[_i];
            }
            return new MemberRemoveCommandImpl(this, AdminImpl._concat(first, others));
        };
        AdminImpl.prototype.appendMembers = function (first) {
            var others = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                others[_i - 1] = arguments[_i];
            }
            return new MemberAppendCommandImpl(this, AdminImpl._concat(first, others));
        };
        AdminImpl.prototype.create = function () {
            return new CreateCommandImpl(this);
        };
        AdminImpl.prototype.destroy = function () {
            return new DestroyCommandImpl(this);
        };
        return AdminImpl;
    }(common_1.CommonServiceImpl));
    exports.AdminImpl = AdminImpl;
});