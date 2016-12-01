define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (Media) {
        Media[Media["TEXT"] = 0] = "TEXT";
        Media[Media["IMAGE"] = 1] = "IMAGE";
        Media[Media["AUDIO"] = 2] = "AUDIO";
        Media[Media["VIDEO"] = 3] = "VIDEO";
    })(exports.Media || (exports.Media = {}));
    var Media = exports.Media;
    (function (Receiver) {
        Receiver[Receiver["ACTOR"] = 0] = "ACTOR";
        Receiver[Receiver["GROUP"] = 1] = "GROUP";
        Receiver[Receiver["ROOM"] = 2] = "ROOM";
        Receiver[Receiver["PASSENGER"] = 3] = "PASSENGER";
        Receiver[Receiver["STRANGER"] = 4] = "STRANGER";
    })(exports.Receiver || (exports.Receiver = {}));
    var Receiver = exports.Receiver;
});

//# sourceMappingURL=messages.js.map
