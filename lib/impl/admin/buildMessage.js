"use strict";
var messages_1 = require("../../model/messages");
var launcher_1 = require("./launcher");
var AdminMessageBuilderImpl = (function () {
    function AdminMessageBuilderImpl(admin, text, remark) {
        this.admin = admin;
        this.message = {
            content: {
                media: messages_1.Media.TEXT,
                body: text,
            },
        };
        if (remark !== undefined && remark !== null) {
            this.message.remark = remark;
        }
    }
    AdminMessageBuilderImpl.prototype.disablePush = function () {
        this.touchPush().enable = false;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushSound = function (sound) {
        this.touchPush().sound = sound;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushBadge = function (badge) {
        this.touchPush().badge = badge;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushContentAvailable = function (contentAvailable) {
        this.touchPush().contentAvailable = contentAvailable;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushPrefix = function (prefix) {
        this.touchPush().prefix = prefix;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushSuffix = function (suffix) {
        this.touchPush().suffix = suffix;
        return this;
    };
    AdminMessageBuilderImpl.prototype.setPushTextOverwrite = function (text) {
        this.touchPush().overwrite = text;
        return this;
    };
    AdminMessageBuilderImpl.prototype.asText = function () {
        this.message.content.media = messages_1.Media.TEXT;
        return this;
    };
    AdminMessageBuilderImpl.prototype.asImage = function () {
        this.message.content.media = messages_1.Media.IMAGE;
        return this;
    };
    AdminMessageBuilderImpl.prototype.asAudio = function () {
        this.message.content.media = messages_1.Media.AUDIO;
        return undefined;
    };
    AdminMessageBuilderImpl.prototype.asVideo = function () {
        this.message.content.media = messages_1.Media.VIDEO;
        return undefined;
    };
    AdminMessageBuilderImpl.prototype.toAll = function () {
        this.receiver = {};
        return new launcher_1.AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
    };
    AdminMessageBuilderImpl.prototype.toUser = function (userid) {
        this.receiver = {
            id: userid,
            type: messages_1.Receiver.ACTOR,
        };
        return new launcher_1.AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
    };
    AdminMessageBuilderImpl.prototype.toGroup = function (groupid) {
        this.receiver = {
            id: groupid,
            type: messages_1.Receiver.GROUP,
        };
        return new launcher_1.AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
    };
    AdminMessageBuilderImpl.prototype.toRoom = function (roomid) {
        this.receiver = {
            id: roomid,
            type: messages_1.Receiver.ROOM,
        };
        return new launcher_1.AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
    };
    AdminMessageBuilderImpl.prototype.touchPush = function () {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    };
    return AdminMessageBuilderImpl;
}());
exports.AdminMessageBuilderImpl = AdminMessageBuilderImpl;

//# sourceMappingURL=buildMessage.js.map
