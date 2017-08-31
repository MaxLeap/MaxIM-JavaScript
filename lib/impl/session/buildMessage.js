"use strict";
var messages_1 = require("../../model/messages");
var launcher_1 = require("./launcher");
var MessageBuilderImpl = (function () {
    function MessageBuilderImpl(session, text, remark) {
        this.session = session;
        this.message = {
            to: {
                id: null,
            },
            content: {
                media: messages_1.Media.TEXT,
                body: text,
            },
        };
        if (remark != null) {
            this.message.remark = remark;
        }
    }
    MessageBuilderImpl.prototype.ack = function (ack) {
        this.message.ack = parseInt("" + ack, 0);
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
        return this;
    };
    MessageBuilderImpl.prototype.asVideo = function () {
        this.message.content.media = messages_1.Media.VIDEO;
        return this;
    };
    MessageBuilderImpl.prototype.disablePush = function () {
        this.createPushIfNotExist().enable = false;
        return this;
    };
    MessageBuilderImpl.prototype.setPushSound = function (sound) {
        this.createPushIfNotExist().sound = sound;
        return this;
    };
    MessageBuilderImpl.prototype.setPushBadge = function (badge) {
        this.createPushIfNotExist().badge = badge;
        return this;
    };
    MessageBuilderImpl.prototype.setPushContentAvailable = function (contentAvailable) {
        this.createPushIfNotExist().contentAvailable = contentAvailable;
        return this;
    };
    MessageBuilderImpl.prototype.setPushPrefix = function (prefix) {
        this.createPushIfNotExist().prefix = prefix;
        return this;
    };
    MessageBuilderImpl.prototype.setPushSuffix = function (suffix) {
        this.createPushIfNotExist().suffix = suffix;
        return this;
    };
    MessageBuilderImpl.prototype.setPushTextOverwrite = function (text) {
        this.createPushIfNotExist().overwrite = text;
        return this;
    };
    MessageBuilderImpl.prototype.toFriend = function (friend) {
        this.message.to.id = friend;
        this.message.to.type = messages_1.Receiver.ACTOR;
        return new launcher_1.MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toGroup = function (groupid) {
        this.message.to.id = groupid;
        this.message.to.type = messages_1.Receiver.GROUP;
        return new launcher_1.MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toRoom = function (roomid) {
        this.message.to.id = roomid;
        this.message.to.type = messages_1.Receiver.ROOM;
        return new launcher_1.MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toPassenger = function (passengerid) {
        this.message.to.id = passengerid;
        this.message.to.type = messages_1.Receiver.PASSENGER;
        return new launcher_1.MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.toStranger = function (strangerid) {
        this.message.to.id = strangerid;
        this.message.to.type = messages_1.Receiver.STRANGER;
        return new launcher_1.MessageLauncherImpl(this.session, this.message);
    };
    MessageBuilderImpl.prototype.createPushIfNotExist = function () {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    };
    return MessageBuilderImpl;
}());
exports.MessageBuilderImpl = MessageBuilderImpl;

//# sourceMappingURL=buildMessage.js.map
