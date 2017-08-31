"use strict";
var buildMessage_1 = require("./buildMessage");
var PassengerSessionImpl = (function () {
    function PassengerSessionImpl(socket, passengerid) {
        this.socket = socket;
        this.id = passengerid;
    }
    PassengerSessionImpl.prototype.say = function (text, remark) {
        return new buildMessage_1.PassengerMessageBuilderImpl(this, text, remark);
    };
    PassengerSessionImpl.prototype.close = function (callback) {
        if (this.closed) {
            return;
        }
        this.closed = true;
        this.socket.close();
    };
    return PassengerSessionImpl;
}());
exports.PassengerSessionImpl = PassengerSessionImpl;

//# sourceMappingURL=session.js.map
