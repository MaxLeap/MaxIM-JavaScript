"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Media;
(function (Media) {
    Media[Media["TEXT"] = 0] = "TEXT";
    Media[Media["IMAGE"] = 1] = "IMAGE";
    Media[Media["AUDIO"] = 2] = "AUDIO";
    Media[Media["VIDEO"] = 3] = "VIDEO";
})(Media = exports.Media || (exports.Media = {}));
var Receiver;
(function (Receiver) {
    Receiver[Receiver["ACTOR"] = 0] = "ACTOR";
    Receiver[Receiver["GROUP"] = 1] = "GROUP";
    Receiver[Receiver["ROOM"] = 2] = "ROOM";
    Receiver[Receiver["PASSENGER"] = 3] = "PASSENGER";
    Receiver[Receiver["STRANGER"] = 4] = "STRANGER";
})(Receiver = exports.Receiver || (exports.Receiver = {}));
