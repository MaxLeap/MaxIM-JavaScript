"use strict";
var messages_1 = require("../../model/messages");
var launcher_1 = require("./launcher");
var PassengerMessageBuilderImpl = (function () {
    function PassengerMessageBuilderImpl(session, text, remark) {
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
    PassengerMessageBuilderImpl.prototype.disablePush = function () {
        this.createPushIfNotExist().enable = false;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushSound = function (sound) {
        this.createPushIfNotExist().sound = sound;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushBadge = function (badge) {
        this.createPushIfNotExist().badge = badge;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushContentAvailable = function (contentAvailable) {
        this.createPushIfNotExist().contentAvailable = contentAvailable;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushPrefix = function (prefix) {
        this.createPushIfNotExist().prefix = prefix;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushSuffix = function (suffix) {
        this.createPushIfNotExist().suffix = suffix;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.setPushTextOverwrite = function (text) {
        this.createPushIfNotExist().overwrite = text;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.asText = function () {
        this.message.content.media = messages_1.Media.TEXT;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.asImage = function () {
        this.message.content.media = messages_1.Media.IMAGE;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.asAudio = function () {
        this.message.content.media = messages_1.Media.AUDIO;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.asVideo = function () {
        this.message.content.media = messages_1.Media.VIDEO;
        return this;
    };
    PassengerMessageBuilderImpl.prototype.toUser = function (userid) {
        this.message.to.id = userid;
        return new launcher_1.PassengerMessageLauncherImpl(this.session, this.message);
    };
    PassengerMessageBuilderImpl.prototype.createPushIfNotExist = function () {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    };
    return PassengerMessageBuilderImpl;
}());
exports.PassengerMessageBuilderImpl = PassengerMessageBuilderImpl;

//# sourceMappingURL=buildMessage.js.map
