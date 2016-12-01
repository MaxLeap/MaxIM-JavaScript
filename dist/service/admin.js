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
        define(["require", "exports", "./common", "../model/messages", "axios"], factory);
    }
})(function (require, exports) {
    "use strict";
    var common_1 = require("./common");
    var messages_1 = require("../model/messages");
    var axios = require("axios");
    var GroupDestroyImpl = (function () {
        function GroupDestroyImpl(admin, groupid) {
            this.admin = admin;
            this.groupid = groupid;
        }
        GroupDestroyImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/groups/" + this.groupid;
            axios.delete(url, { headers: this.admin.options().headers })
                .then(function (response) {
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
        return GroupDestroyImpl;
    }());
    var RoomDestroyImpl = (function () {
        function RoomDestroyImpl(admin, roomid) {
            this.admin = admin;
            this.roomid = roomid;
        }
        RoomDestroyImpl.prototype.ok = function (callback) {
            var url = this.admin.options().server + "/rooms/" + this.roomid;
            axios.delete(url, { headers: this.admin.options().headers })
                .then(function (response) {
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
            var url = this.admin.options().server + "/groups";
            var data = {
                owner: this.owner,
                members: this.appends
            };
            axios.post(url, JSON.stringify(data), { headers: this.admin.options().headers })
                .then(function (response) {
                return response.data;
            })
                .then(function (groupid) {
                _this.admin
                    .setAttributes(_this.attributes)
                    .forGroup(groupid, function (err) {
                    if (callback) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null, groupid);
                        }
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
            axios.post(url, JSON.stringify(this.members), { headers: this.admin.options().headers })
                .then(function (response) {
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
            var req = {
                url: url,
                method: 'DELETE',
                data: JSON.stringify(this.members),
                headers: op.headers
            };
            axios.request(req)
                .then(function (response) {
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
            return new MessageLauncherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toUser = function (userid) {
            this.receiver = {
                id: userid,
                type: messages_1.Receiver.ACTOR
            };
            return new MessageLauncherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toGroup = function (groupid) {
            this.receiver = {
                id: groupid,
                type: messages_1.Receiver.GROUP
            };
            return new MessageLauncherImpl(this.admin, this.message, this.receiver);
        };
        MessageBuilderImpl.prototype.toRoom = function (roomid) {
            this.receiver = {
                id: roomid,
                type: messages_1.Receiver.ROOM
            };
            return new MessageLauncherImpl(this.admin, this.message, this.receiver);
        };
        return MessageBuilderImpl;
    }());
    var MessageLauncherImpl = (function () {
        function MessageLauncherImpl(admin, message, receiver) {
            this.admin = admin;
            this.message = message;
            this.receiver = receiver;
        }
        MessageLauncherImpl.prototype.ok = function (callback) {
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
            axios.post(url, JSON.stringify(this.message), { headers: this.admin.options().headers })
                .then(function (response) {
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
        return MessageLauncherImpl;
    }());
    var AttributeBuilderImpl = (function () {
        function AttributeBuilderImpl(admin, attributes, overwrite) {
            this.admin = admin;
            this.attributes = attributes;
            this.overwrite = overwrite || false;
        }
        AttributeBuilderImpl.prototype.process = function (path, callback) {
            var url = "" + this.admin.options().server + path;
            var postData = JSON.stringify(this.attributes);
            var cfg = { headers: this.admin.options().headers };
            (this.overwrite ? axios.put(url, postData, cfg) : axios.post(url, postData, cfg))
                .then(function (response) {
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
            var config = { headers: op.headers };
            axios.post(url, JSON.stringify(body), config)
                .then(function (response) {
                return response.data;
            })
                .then(function (roomid) {
                var url2 = op.server + "/rooms/" + roomid + "/attributes";
                var postData = JSON.stringify(_this.attributes);
                return axios.post(url2, postData, { headers: op.headers })
                    .then(function (response) {
                    return roomid;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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YTtZQUFFLGdCQUFTO2lCQUFULFdBQVMsQ0FBVCxzQkFBUyxDQUFULElBQVM7Z0JBQVQsK0JBQVM7O1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLHVCQUF1QixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCxpQ0FBYSxHQUFiLFVBQWMsS0FBYTtZQUFFLGdCQUFTO2lCQUFULFdBQVMsQ0FBVCxzQkFBUyxDQUFULElBQVM7Z0JBQVQsK0JBQVM7O1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLHVCQUF1QixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCwwQkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELDJCQUFPLEdBQVA7WUFDSSxNQUFNLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQXBDQSxBQW9DQyxDQXBDOEIsMEJBQWlCLEdBb0MvQztJQXBDWSxpQkFBUyxZQW9DckIsQ0FBQSIsImZpbGUiOiJzZXJ2aWNlL2FkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21tb25TZXJ2aWNlLCBDb21tb25TZXJ2aWNlSW1wbH0gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge1N5c3RlbU1lc3NhZ2VUbywgTWVkaWEsIFJlY2VpdmVyLCBQdXNoU2V0dGluZ3N9IGZyb20gXCIuLi9tb2RlbC9tZXNzYWdlc1wiO1xuaW1wb3J0IHtBdHRyaWJ1dGVzLCBDYWxsYmFja30gZnJvbSBcIi4uL21vZGVsL21vZGVsc1wiO1xuaW1wb3J0IGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xuaW1wb3J0IFJlc3BvbnNlSW50ZXJjZXB0b3IgPSBBeGlvcy5SZXNwb25zZUludGVyY2VwdG9yO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFkbWluIGV4dGVuZHMgQ29tbW9uU2VydmljZSB7XG4gICAgLyoqXG4gICAgICog5Y+R6YCB57O757uf5raI5oGvXG4gICAgICogQHBhcmFtIHRleHRcbiAgICAgKiBAcGFyYW0gcmVtYXJrXG4gICAgICovXG4gICAgc2F5KHRleHQ6IHN0cmluZywgcmVtYXJrPzogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgLyoqXG4gICAgICog5bGe5oCn6K6+572uXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlXG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlcyhhdHRyaWJ1dGVzOiBBdHRyaWJ1dGVzLCBvdmVyd3JpdGU/OiBib29sZWFuKTogQXR0cmlidXRlQnVpbGRlcjtcbiAgICAvKipcbiAgICAgKiDliJvlu7pcbiAgICAgKi9cbiAgICBjcmVhdGUoKTogQ3JlYXRlQ29tbWFuZDtcblxuICAgIC8qKlxuICAgICAqIOmUgOavgVxuICAgICAqL1xuICAgIGRlc3Ryb3koKTogRGVzdHJveUNvbW1hbmQ7XG4gICAgLyoqXG4gICAgICog56e76Zmk5oiQ5ZGYXG4gICAgICogQHBhcmFtIGZpcnN0XG4gICAgICogQHBhcmFtIG90aGVyc1xuICAgICAqL1xuICAgIHJlbW92ZU1lbWJlcnMoZmlyc3Q6IHN0cmluZywgLi4ub3RoZXJzOiBzdHJpbmdbXSk6IE1lbWJlclJlbW92ZUNvbW1hbmQ7XG5cbiAgICAvKipcbiAgICAgKiDov73liqDmiJDlkZhcbiAgICAgKiBAcGFyYW0gZmlyc3RcbiAgICAgKiBAcGFyYW0gb3RoZXJzXG4gICAgICovXG4gICAgYXBwZW5kTWVtYmVycyhmaXJzdDogc3RyaW5nLCAuLi5vdGhlcnM6IHN0cmluZ1tdKTogTWVtYmVyQXBwZW5kQ29tbWFuZDtcblxufVxuXG5pbnRlcmZhY2UgQ3JlYXRlQ29tbWFuZCB7XG4gICAgZ3JvdXAob3duZXI6IHN0cmluZyk6IEdyb3VwQnVpbGRlcjtcbiAgICByb29tKCk6IFJvb21CdWlsZGVyO1xufVxuXG5pbnRlcmZhY2UgRGVzdHJveUNvbW1hbmQge1xuICAgIGdyb3VwKGdyb3VwaWQ6IHN0cmluZyk6IEdyb3VwRGVzdHJveTtcbiAgICByb29tKHJvb21pZDogc3RyaW5nKTogUm9vbURlc3Ryb3k7XG59XG5cbmludGVyZmFjZSBHcm91cERlc3Ryb3kge1xuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbjtcbn1cblxuY2xhc3MgR3JvdXBEZXN0cm95SW1wbCBpbXBsZW1lbnRzIEdyb3VwRGVzdHJveSB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSBncm91cGlkOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihhZG1pbjogQWRtaW5JbXBsLCBncm91cGlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hZG1pbiA9IGFkbWluO1xuICAgICAgICB0aGlzLmdyb3VwaWQgPSBncm91cGlkO1xuICAgIH1cblxuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbiB7XG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLmFkbWluLm9wdGlvbnMoKS5zZXJ2ZXJ9L2dyb3Vwcy8ke3RoaXMuZ3JvdXBpZH1gO1xuXG4gICAgICAgIGF4aW9zLmRlbGV0ZSh1cmwsIHtoZWFkZXJzOiB0aGlzLmFkbWluLm9wdGlvbnMoKS5oZWFkZXJzfSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIFJvb21EZXN0cm95IHtcbiAgICBvayhjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW47XG59XG5cbmNsYXNzIFJvb21EZXN0cm95SW1wbCBpbXBsZW1lbnRzIFJvb21EZXN0cm95IHtcblxuICAgIHByaXZhdGUgYWRtaW46IEFkbWluSW1wbDtcbiAgICBwcml2YXRlIHJvb21pZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoYWRtaW46IEFkbWluSW1wbCwgcm9vbWlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hZG1pbiA9IGFkbWluO1xuICAgICAgICB0aGlzLnJvb21pZCA9IHJvb21pZDtcbiAgICB9XG5cbiAgICBvayhjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW4ge1xuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy5hZG1pbi5vcHRpb25zKCkuc2VydmVyfS9yb29tcy8ke3RoaXMucm9vbWlkfWA7XG5cbiAgICAgICAgYXhpb3MuZGVsZXRlKHVybCwge2hlYWRlcnM6IHRoaXMuYWRtaW4ub3B0aW9ucygpLmhlYWRlcnN9KVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRtaW47XG4gICAgfVxufVxuXG5jbGFzcyBEZXN0cm95Q29tbWFuZEltcGwgaW1wbGVtZW50cyBEZXN0cm95Q29tbWFuZCB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhZG1pbjogQWRtaW5JbXBsKSB7XG4gICAgICAgIHRoaXMuYWRtaW4gPSBhZG1pbjtcbiAgICB9XG5cbiAgICBncm91cChncm91cGlkOiBzdHJpbmcpOiBHcm91cERlc3Ryb3kge1xuICAgICAgICByZXR1cm4gbmV3IEdyb3VwRGVzdHJveUltcGwodGhpcy5hZG1pbiwgZ3JvdXBpZCk7XG4gICAgfVxuXG4gICAgcm9vbShyb29taWQ6IHN0cmluZyk6IFJvb21EZXN0cm95IHtcbiAgICAgICAgcmV0dXJuIG5ldyBSb29tRGVzdHJveUltcGwodGhpcy5hZG1pbiwgcm9vbWlkKTtcbiAgICB9XG59XG5cblxuY2xhc3MgQ3JlYXRlQ29tbWFuZEltcGwgaW1wbGVtZW50cyBDcmVhdGVDb21tYW5kIHtcblxuICAgIHByaXZhdGUgYWRtaW46IEFkbWluSW1wbDtcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwpIHtcbiAgICAgICAgdGhpcy5hZG1pbiA9IGFkbWluO1xuICAgIH1cblxuICAgIGdyb3VwKG93bmVyOiBzdHJpbmcpOiBHcm91cEJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IEdyb3VwQnVpbGRlckltcGwodGhpcy5hZG1pbiwgb3duZXIpO1xuICAgIH1cblxuICAgIHJvb20oKTogUm9vbUJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IFJvb21CdWlsZGVySW1wbCh0aGlzLmFkbWluKTtcbiAgICB9XG59XG5cbmludGVyZmFjZSBHcm91cEJ1aWxkZXIge1xuICAgIGF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IEdyb3VwQnVpbGRlcjtcbiAgICBtZW1iZXJzKGZpcnN0OiBzdHJpbmcsIC4uLm90aGVyczogc3RyaW5nW10pOiBHcm91cEJ1aWxkZXI7XG4gICAgb2soY2FsbGJhY2s/OiBDYWxsYmFjazxzdHJpbmc+KTogQWRtaW47XG59XG5cbmNsYXNzIEdyb3VwQnVpbGRlckltcGwgaW1wbGVtZW50cyBHcm91cEJ1aWxkZXIge1xuXG4gICAgcHJpdmF0ZSBhZG1pbjogQWRtaW5JbXBsO1xuICAgIHByaXZhdGUgb3duZXI6IHN0cmluZztcbiAgICBwcml2YXRlIGFwcGVuZHM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgYXR0cmlidXRlczogQXR0cmlidXRlcztcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwsIG93bmVyOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hZG1pbiA9IGFkbWluO1xuICAgICAgICB0aGlzLmFwcGVuZHMgPSBbXTtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgIH1cblxuICAgIGF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IEdyb3VwQnVpbGRlciB7XG4gICAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtZW1iZXJzKGZpcnN0OiBzdHJpbmcsIG90aGVyczogc3RyaW5nKTogR3JvdXBCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5hcHBlbmRzLnB1c2goZmlyc3QpO1xuICAgICAgICBpZiAob3RoZXJzICYmIG90aGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBzIG9mIG90aGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kcy5wdXNoKHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8c3RyaW5nPik6IEFkbWluIHtcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMuYWRtaW4ub3B0aW9ucygpLnNlcnZlcn0vZ3JvdXBzYDtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBvd25lcjogdGhpcy5vd25lcixcbiAgICAgICAgICAgIG1lbWJlcnM6IHRoaXMuYXBwZW5kc1xuICAgICAgICB9O1xuXG4gICAgICAgIGF4aW9zLnBvc3QodXJsLCBKU09OLnN0cmluZ2lmeShkYXRhKSwge2hlYWRlcnM6IHRoaXMuYWRtaW4ub3B0aW9ucygpLmhlYWRlcnN9KVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhIGFzIHN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihncm91cGlkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkbWluXG4gICAgICAgICAgICAgICAgICAgIC5zZXRBdHRyaWJ1dGVzKHRoaXMuYXR0cmlidXRlcylcbiAgICAgICAgICAgICAgICAgICAgLmZvckdyb3VwKGdyb3VwaWQsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBncm91cGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIE1lbWJlckFwcGVuZENvbW1hbmQge1xuICAgIGludG9Sb29tKHJvb21pZDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW47XG4gICAgaW50b0dyb3VwKGdyb3VwaWQ6IHN0cmluZywgY2FsbGJhY2s/OiBDYWxsYmFjazx2b2lkPik6IEFkbWluO1xufVxuXG5pbnRlcmZhY2UgTWVtYmVyUmVtb3ZlQ29tbWFuZCB7XG4gICAgZnJvbVJvb20ocm9vbWlkOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbjtcbiAgICBmcm9tR3JvdXAoZ3JvdXBpZDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW47XG59XG5cbmNsYXNzIE1lbWJlckFwcGVuZENvbW1hbmRJbXBsIGltcGxlbWVudHMgTWVtYmVyQXBwZW5kQ29tbWFuZCB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSBtZW1iZXJzOiB7XG4gICAgICAgIG1lbWJlcnM6IHN0cmluZ1tdXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwsIG1lbWJlcnM6IHN0cmluZ1tdKSB7XG4gICAgICAgIHRoaXMuYWRtaW4gPSBhZG1pbjtcbiAgICAgICAgdGhpcy5tZW1iZXJzID0ge1xuICAgICAgICAgICAgbWVtYmVyczogbWVtYmVyc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2FwcGVuZChwYXRoOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbiB7XG4gICAgICAgIGxldCB1cmwgPSBgJHt0aGlzLmFkbWluLm9wdGlvbnMoKS5zZXJ2ZXJ9JHtwYXRofS9tZW1iZXJzYDtcbiAgICAgICAgYXhpb3MucG9zdCh1cmwsIEpTT04uc3RyaW5naWZ5KHRoaXMubWVtYmVycyksIHtoZWFkZXJzOiB0aGlzLmFkbWluLm9wdGlvbnMoKS5oZWFkZXJzfSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cblxuICAgIGludG9Sb29tKHJvb21pZDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwZW5kKGAvcm9vbXMvJHtyb29taWR9YCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGludG9Hcm91cChncm91cGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBlbmQoYC9ncm91cHMvJHtncm91cGlkfWAsIGNhbGxiYWNrKTtcbiAgICB9XG5cbn1cblxuY2xhc3MgTWVtYmVyUmVtb3ZlQ29tbWFuZEltcGwgaW1wbGVtZW50cyBNZW1iZXJSZW1vdmVDb21tYW5kIHtcblxuICAgIHByaXZhdGUgYWRtaW46IEFkbWluSW1wbDtcbiAgICBwcml2YXRlIG1lbWJlcnM6IHtcbiAgICAgICAgbWVtYmVyczogc3RyaW5nW107XG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwsIG1lbWJlcnM6IHN0cmluZ1tdKSB7XG4gICAgICAgIHRoaXMuYWRtaW4gPSBhZG1pbjtcbiAgICAgICAgdGhpcy5tZW1iZXJzID0ge1xuICAgICAgICAgICAgbWVtYmVyczogbWVtYmVyc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2RlbGV0ZShwYXRoOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbiB7XG4gICAgICAgIGxldCBvcCA9IHRoaXMuYWRtaW4ub3B0aW9ucygpO1xuICAgICAgICBsZXQgdXJsID0gYCR7b3Auc2VydmVyfSR7cGF0aH0vbWVtYmVyc2A7XG4gICAgICAgIGxldCByZXEgPSB7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLm1lbWJlcnMpLFxuICAgICAgICAgICAgaGVhZGVyczogb3AuaGVhZGVyc1xuICAgICAgICB9O1xuICAgICAgICBheGlvcy5yZXF1ZXN0KHJlcSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cblxuICAgIGZyb21Sb29tKHJvb21pZDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVsZXRlKGAvcm9vbXMvJHtyb29taWR9YCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZyb21Hcm91cChncm91cGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWxldGUoYC9ncm91cHMvJHtncm91cGlkfWAsIGNhbGxiYWNrKTtcbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VCdWlsZGVyIHtcbiAgICBhc1RleHQoKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgYXNJbWFnZSgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBhc0F1ZGlvKCk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIGFzVmlkZW8oKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICBkaXNhYmxlUHVzaCgpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU291bmQoc291bmQ6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hCYWRnZShiYWRnZTogbnVtYmVyKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyO1xuICAgIHNldFB1c2hQcmVmaXgocHJlZml4OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlcjtcbiAgICBzZXRQdXNoU3VmZml4KHN1ZmZpeDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG4gICAgc2V0UHVzaFRleHRPdmVyd3JpdGUodGV4dDogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXI7XG5cbiAgICB0b0FsbCgpOiBNZXNzYWdlTGF1bmNoZXI7XG4gICAgdG9Vc2VyKHVzZXJpZDogc3RyaW5nKTogTWVzc2FnZUxhdW5jaGVyO1xuICAgIHRvR3JvdXAoZ3JvdXBpZDogc3RyaW5nKTogTWVzc2FnZUxhdW5jaGVyO1xuICAgIHRvUm9vbShyb29taWQ6IHN0cmluZyk6IE1lc3NhZ2VMYXVuY2hlcjtcbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VMYXVuY2hlciB7XG4gICAgb2soY2FsbGJhY2s/OiBDYWxsYmFjazx2b2lkPik6IEFkbWluO1xufVxuXG5jbGFzcyBNZXNzYWdlQnVpbGRlckltcGwgaW1wbGVtZW50cyBNZXNzYWdlQnVpbGRlciB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSByZWNlaXZlcjoge1xuICAgICAgICBpZD86IHN0cmluZztcbiAgICAgICAgdHlwZT86IFJlY2VpdmVyXG4gICAgfTtcbiAgICBwcml2YXRlIG1lc3NhZ2U6IFN5c3RlbU1lc3NhZ2VUbztcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwsIHRleHQ6IHN0cmluZywgcmVtYXJrPzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYWRtaW4gPSBhZG1pbjtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0ge1xuICAgICAgICAgICAgY29udGVudDoge1xuICAgICAgICAgICAgICAgIG1lZGlhOiBNZWRpYS5URVhULFxuICAgICAgICAgICAgICAgIGJvZHk6IHRleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlbWFyayAhPT0gdW5kZWZpbmVkICYmIHJlbWFyayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlLnJlbWFyayA9IHJlbWFyaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdG91Y2hQdXNoKCk6IFB1c2hTZXR0aW5ncyB7XG4gICAgICAgIGlmICghdGhpcy5tZXNzYWdlLnB1c2gpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5wdXNoID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZS5wdXNoO1xuICAgIH1cblxuICAgIGRpc2FibGVQdXNoKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy50b3VjaFB1c2goKS5lbmFibGUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaFNvdW5kKHNvdW5kOiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMudG91Y2hQdXNoKCkuc291bmQgPSBzb3VuZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaEJhZGdlKGJhZGdlOiBudW1iZXIpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMudG91Y2hQdXNoKCkuYmFkZ2UgPSBiYWRnZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaENvbnRlbnRBdmFpbGFibGUoY29udGVudEF2YWlsYWJsZTogYm9vbGVhbik6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy50b3VjaFB1c2goKS5jb250ZW50QXZhaWxhYmxlID0gY29udGVudEF2YWlsYWJsZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0UHVzaFByZWZpeChwcmVmaXg6IHN0cmluZyk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy50b3VjaFB1c2goKS5wcmVmaXggPSBwcmVmaXg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldFB1c2hTdWZmaXgoc3VmZml4OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMudG91Y2hQdXNoKCkuc3VmZml4ID0gc3VmZml4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRQdXNoVGV4dE92ZXJ3cml0ZSh0ZXh0OiBzdHJpbmcpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMudG91Y2hQdXNoKCkub3ZlcndyaXRlID0gdGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXNUZXh0KCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQubWVkaWEgPSBNZWRpYS5URVhUO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhc0ltYWdlKCk6IE1lc3NhZ2VCdWlsZGVyIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmNvbnRlbnQubWVkaWEgPSBNZWRpYS5JTUFHRTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXNBdWRpbygpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS5jb250ZW50Lm1lZGlhID0gTWVkaWEuQVVESU87XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXNWaWRlbygpOiBNZXNzYWdlQnVpbGRlciB7XG4gICAgICAgIHRoaXMubWVzc2FnZS5jb250ZW50Lm1lZGlhID0gTWVkaWEuVklERU87XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdG9BbGwoKTogTWVzc2FnZUxhdW5jaGVyIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlciA9IHt9O1xuICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2VMYXVuY2hlckltcGwodGhpcy5hZG1pbiwgdGhpcy5tZXNzYWdlLCB0aGlzLnJlY2VpdmVyKTtcbiAgICB9XG5cbiAgICB0b1VzZXIodXNlcmlkOiBzdHJpbmcpOiBNZXNzYWdlTGF1bmNoZXIge1xuICAgICAgICB0aGlzLnJlY2VpdmVyID0ge1xuICAgICAgICAgICAgaWQ6IHVzZXJpZCxcbiAgICAgICAgICAgIHR5cGU6IFJlY2VpdmVyLkFDVE9SXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUxhdW5jaGVySW1wbCh0aGlzLmFkbWluLCB0aGlzLm1lc3NhZ2UsIHRoaXMucmVjZWl2ZXIpO1xuICAgIH1cblxuICAgIHRvR3JvdXAoZ3JvdXBpZDogc3RyaW5nKTogTWVzc2FnZUxhdW5jaGVyIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlciA9IHtcbiAgICAgICAgICAgIGlkOiBncm91cGlkLFxuICAgICAgICAgICAgdHlwZTogUmVjZWl2ZXIuR1JPVVBcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNzYWdlTGF1bmNoZXJJbXBsKHRoaXMuYWRtaW4sIHRoaXMubWVzc2FnZSwgdGhpcy5yZWNlaXZlcik7XG4gICAgfVxuXG4gICAgdG9Sb29tKHJvb21pZDogc3RyaW5nKTogTWVzc2FnZUxhdW5jaGVyIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlciA9IHtcbiAgICAgICAgICAgIGlkOiByb29taWQsXG4gICAgICAgICAgICB0eXBlOiBSZWNlaXZlci5ST09NXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgTWVzc2FnZUxhdW5jaGVySW1wbCh0aGlzLmFkbWluLCB0aGlzLm1lc3NhZ2UsIHRoaXMucmVjZWl2ZXIpO1xuICAgIH1cbn1cblxuY2xhc3MgTWVzc2FnZUxhdW5jaGVySW1wbCBpbXBsZW1lbnRzIE1lc3NhZ2VMYXVuY2hlciB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSBtZXNzYWdlOiBTeXN0ZW1NZXNzYWdlVG87XG4gICAgcHJpdmF0ZSByZWNlaXZlcjoge1xuICAgICAgICB0eXBlPzogUmVjZWl2ZXI7XG4gICAgICAgIGlkPzogc3RyaW5nO1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihhZG1pbjogQWRtaW5JbXBsLCBtZXNzYWdlOiBTeXN0ZW1NZXNzYWdlVG8sIHJlY2VpdmVyOiB7dHlwZT86IFJlY2VpdmVyO2lkPzogc3RyaW5nfSkge1xuICAgICAgICB0aGlzLmFkbWluID0gYWRtaW47XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMucmVjZWl2ZXIgPSByZWNlaXZlcjtcbiAgICB9XG5cbiAgICBvayhjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW4ge1xuICAgICAgICBsZXQgdXJsID0gYCR7dGhpcy5hZG1pbi5vcHRpb25zKCkuc2VydmVyfS9zeXN0ZW1gO1xuXG4gICAgICAgIGlmICh0aGlzLnJlY2VpdmVyLmlkKSB7XG4gICAgICAgICAgICB1cmwgKz0gYC8ke3RoaXMucmVjZWl2ZXIuaWR9YDtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5yZWNlaXZlci50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBSZWNlaXZlci5HUk9VUDpcbiAgICAgICAgICAgICAgICAgICAgdXJsICs9ICc/Z3JvdXAnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFJlY2VpdmVyLlJPT006XG4gICAgICAgICAgICAgICAgICAgIHVybCArPSAnP3Jvb20nO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGF4aW9zLnBvc3QodXJsLCBKU09OLnN0cmluZ2lmeSh0aGlzLm1lc3NhZ2UpLCB7aGVhZGVyczogdGhpcy5hZG1pbi5vcHRpb25zKCkuaGVhZGVyc30pXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5hZG1pbjtcbiAgICB9XG5cbn1cblxuaW50ZXJmYWNlIEF0dHJpYnV0ZUJ1aWxkZXIge1xuICAgIGZvclVzZXIodXNlcmlkOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbjtcbiAgICBmb3JHcm91cChncm91cGlkOiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2s8dm9pZD4pOiBBZG1pbjtcbiAgICBmb3JSb29tKHJvb21pZDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrPHZvaWQ+KTogQWRtaW47XG59XG5cbmNsYXNzIEF0dHJpYnV0ZUJ1aWxkZXJJbXBsIGltcGxlbWVudHMgQXR0cmlidXRlQnVpbGRlciB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSBhdHRyaWJ1dGVzOiBBdHRyaWJ1dGVzO1xuICAgIHByaXZhdGUgb3ZlcndyaXRlOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoYWRtaW46IEFkbWluSW1wbCwgYXR0cmlidXRlczogQXR0cmlidXRlcywgb3ZlcndyaXRlPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmFkbWluID0gYWRtaW47XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMub3ZlcndyaXRlID0gb3ZlcndyaXRlIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2VzcyhwYXRoOiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjazx2b2lkPik6IEFkbWluIHtcbiAgICAgICAgbGV0IHVybCA9IGAke3RoaXMuYWRtaW4ub3B0aW9ucygpLnNlcnZlcn0ke3BhdGh9YDtcbiAgICAgICAgbGV0IHBvc3REYXRhID0gSlNPTi5zdHJpbmdpZnkodGhpcy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgbGV0IGNmZyA9IHtoZWFkZXJzOiB0aGlzLmFkbWluLm9wdGlvbnMoKS5oZWFkZXJzfTtcblxuICAgICAgICAodGhpcy5vdmVyd3JpdGUgPyBheGlvcy5wdXQodXJsLCBwb3N0RGF0YSwgY2ZnKSA6IGF4aW9zLnBvc3QodXJsLCBwb3N0RGF0YSwgY2ZnKSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cblxuICAgIGZvclVzZXIodXNlcmlkOiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjazx2b2lkPik6IEFkbWluIHtcbiAgICAgICAgbGV0IHBhdGggPSBgL2N0eC8ke3VzZXJpZH0vYXR0cmlidXRlc2A7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MocGF0aCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZvckdyb3VwKGdyb3VwaWQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrPHZvaWQ+KTogQWRtaW4ge1xuICAgICAgICBsZXQgcGF0aCA9IGAvZ3JvdXBzLyR7Z3JvdXBpZH0vYXR0cmlidXRlc2A7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3MocGF0aCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZvclJvb20ocm9vbWlkOiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjazx2b2lkPik6IEFkbWluIHtcbiAgICAgICAgbGV0IHBhdGggPSBgL3Jvb21zLyR7cm9vbWlkfS9hdHRyaWJ1dGVzYDtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2VzcyhwYXRoLCBjYWxsYmFjayk7XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgUm9vbUJ1aWxkZXIge1xuICAgIGF0dHJpYnV0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IFJvb21CdWlsZGVyO1xuICAgIG1lbWJlcnMoZmlyc3Q6IHN0cmluZywgLi4ub3RoZXJzOiBzdHJpbmdbXSk6IFJvb21CdWlsZGVyO1xuICAgIG9rKGNhbGxiYWNrPzogQ2FsbGJhY2s8c3RyaW5nPik6IEFkbWluO1xufVxuXG5jbGFzcyBSb29tQnVpbGRlckltcGwgaW1wbGVtZW50cyBSb29tQnVpbGRlciB7XG5cbiAgICBwcml2YXRlIGFkbWluOiBBZG1pbkltcGw7XG4gICAgcHJpdmF0ZSBhdHRyaWJ1dGVzOiB7IFtrZXk6IHN0cmluZ106IGFueX07XG4gICAgcHJpdmF0ZSBhcHBlbmRzOiBzdHJpbmdbXTtcblxuICAgIGNvbnN0cnVjdG9yKGFkbWluOiBBZG1pbkltcGwpIHtcbiAgICAgICAgdGhpcy5hZG1pbiA9IGFkbWluO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5hcHBlbmRzID0gW107XG4gICAgfVxuXG4gICAgbWVtYmVycyhmaXJzdDogc3RyaW5nLCAuLi5vdGhlcnM6IHN0cmluZ1tdKTogUm9vbUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmFwcGVuZHMucHVzaChmaXJzdCk7XG4gICAgICAgIGlmIChvdGhlcnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHMgb2Ygb3RoZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRzLnB1c2gocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0cmlidXRlKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUm9vbUJ1aWxkZXIge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNba2V5XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvayhjYWxsYmFjaz86IENhbGxiYWNrPHN0cmluZz4pOiBBZG1pbiB7XG4gICAgICAgIGxldCBvcCA9IHRoaXMuYWRtaW4ub3B0aW9ucygpO1xuICAgICAgICBsZXQgdXJsID0gYCR7b3Auc2VydmVyfS9yb29tc2A7XG4gICAgICAgIGxldCBib2R5ID0ge1xuICAgICAgICAgICAgbWVtYmVyczogdGhpcy5hcHBlbmRzXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNvbmZpZyA9IHtoZWFkZXJzOiBvcC5oZWFkZXJzfTtcbiAgICAgICAgYXhpb3MucG9zdCh1cmwsIEpTT04uc3RyaW5naWZ5KGJvZHkpLCBjb25maWcpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEgYXMgc3RyaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJvb21pZCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVybDIgPSBgJHtvcC5zZXJ2ZXJ9L3Jvb21zLyR7cm9vbWlkfS9hdHRyaWJ1dGVzYDtcbiAgICAgICAgICAgICAgICBsZXQgcG9zdERhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBheGlvcy5wb3N0KHVybDIsIHBvc3REYXRhLCB7aGVhZGVyczogb3AuaGVhZGVyc30pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb29taWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJvb21pZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJvb21pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLmFkbWluO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFkbWluSW1wbCBleHRlbmRzIENvbW1vblNlcnZpY2VJbXBsIGltcGxlbWVudHMgQWRtaW4ge1xuXG4gICAgc2F5KHRleHQ6IHN0cmluZywgcmVtYXJrPzogc3RyaW5nKTogTWVzc2FnZUJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IE1lc3NhZ2VCdWlsZGVySW1wbCh0aGlzLCB0ZXh0LCByZW1hcmspO1xuICAgIH1cblxuICAgIHNldEF0dHJpYnV0ZXMoYXR0cmlidXRlczogQXR0cmlidXRlcywgb3ZlcndyaXRlPzogYm9vbGVhbik6IEF0dHJpYnV0ZUJ1aWxkZXIge1xuICAgICAgICByZXR1cm4gbmV3IEF0dHJpYnV0ZUJ1aWxkZXJJbXBsKHRoaXMsIGF0dHJpYnV0ZXMsIG92ZXJ3cml0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2NvbmNhdChmaXJzdDogc3RyaW5nLCAuLi5vdGhlcnMpOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCBhbGw6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGFsbC5wdXNoKGZpcnN0KTtcbiAgICAgICAgaWYgKG90aGVycyAmJiBvdGhlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgcyBvZiBvdGhlcnMpIHtcbiAgICAgICAgICAgICAgICBhbGwucHVzaChzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWxsO1xuICAgIH1cblxuICAgIHJlbW92ZU1lbWJlcnMoZmlyc3Q6IHN0cmluZywgLi4ub3RoZXJzKTogTWVtYmVyUmVtb3ZlQ29tbWFuZCB7XG4gICAgICAgIHJldHVybiBuZXcgTWVtYmVyUmVtb3ZlQ29tbWFuZEltcGwodGhpcywgQWRtaW5JbXBsLl9jb25jYXQoZmlyc3QsIG90aGVycykpO1xuICAgIH1cblxuICAgIGFwcGVuZE1lbWJlcnMoZmlyc3Q6IHN0cmluZywgLi4ub3RoZXJzKTogTWVtYmVyQXBwZW5kQ29tbWFuZCB7XG4gICAgICAgIHJldHVybiBuZXcgTWVtYmVyQXBwZW5kQ29tbWFuZEltcGwodGhpcywgQWRtaW5JbXBsLl9jb25jYXQoZmlyc3QsIG90aGVycykpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpOiBDcmVhdGVDb21tYW5kIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVDb21tYW5kSW1wbCh0aGlzKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IERlc3Ryb3lDb21tYW5kIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZXN0cm95Q29tbWFuZEltcGwodGhpcyk7XG4gICAgfVxufSJdfQ==
