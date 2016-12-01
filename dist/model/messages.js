(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC9tZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUFHQSxXQUFZLEtBQUs7UUFDYixpQ0FBUSxDQUFBO1FBQ1IsbUNBQVMsQ0FBQTtRQUNULG1DQUFTLENBQUE7UUFDVCxtQ0FBUyxDQUFBO0lBQ2IsQ0FBQyxFQUxXLGFBQUssS0FBTCxhQUFLLFFBS2hCO0lBTEQsSUFBWSxLQUFLLEdBQUwsYUFLWCxDQUFBO0lBRUQsV0FBWSxRQUFRO1FBQ2hCLHlDQUFTLENBQUE7UUFDVCx5Q0FBUyxDQUFBO1FBQ1QsdUNBQVEsQ0FBQTtRQUNSLGlEQUFhLENBQUE7UUFDYiwrQ0FBWSxDQUFBO0lBQ2hCLENBQUMsRUFOVyxnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0lBTkQsSUFBWSxRQUFRLEdBQVIsZ0JBTVgsQ0FBQSIsImZpbGUiOiJtb2RlbC9tZXNzYWdlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERlZmluZSBhbGwgbWVzc2FnZSBzdHJ1Y3QuXG5cbi8vIE1lc3NhZ2UgbWVkaWEgdHlwZTogIDA9dGV4dCwxPWltYWdlLDI9YXVkaW8sMz12aWRlb1xuZXhwb3J0IGVudW0gTWVkaWF7XG4gICAgVEVYVCA9IDAsXG4gICAgSU1BR0UgPSAxLFxuICAgIEFVRElPID0gMixcbiAgICBWSURFTyA9IDNcbn1cblxuZXhwb3J0IGVudW0gUmVjZWl2ZXJ7XG4gICAgQUNUT1IgPSAwLFxuICAgIEdST1VQID0gMSxcbiAgICBST09NID0gMixcbiAgICBQQVNTRU5HRVIgPSAzLFxuICAgIFNUUkFOR0VSID0gNFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRlbnQge1xuICAgIG1lZGlhPzogTWVkaWE7XG4gICAgYm9keTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VUbyB7XG4gICAgdG86IHtcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgdHlwZT86IFJlY2VpdmVyO1xuICAgIH07XG4gICAgY29udGVudDogQ29udGVudDtcbiAgICBwdXNoPzogUHVzaFNldHRpbmdzO1xuICAgIHJlbWFyaz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQdXNoU2V0dGluZ3Mge1xuICAgIGVuYWJsZT86IGJvb2xlYW47XG4gICAgc291bmQ/OiBzdHJpbmc7XG4gICAgcHJlZml4Pzogc3RyaW5nO1xuICAgIHN1ZmZpeD86IHN0cmluZztcbiAgICBvdmVyd3JpdGU/OiBzdHJpbmc7XG4gICAgYmFkZ2U/OiBudW1iZXI7XG4gICAgY29udGVudEF2YWlsYWJsZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZUZyb20ge1xuICAgIGZyb206IHtcbiAgICAgICAgaWQ6IHN0cmluZztcbiAgICAgICAgdHlwZT86IFJlY2VpdmVyO1xuICAgICAgICBnaWQ/OiBzdHJpbmc7XG4gICAgfSxcbiAgICBjb250ZW50OiBDb250ZW50O1xuICAgIHRzOiBudW1iZXI7XG4gICAgcmVtYXJrPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJhc2ljTWVzc2FnZUZyb20ge1xuICAgIGNvbnRlbnQ6IENvbnRlbnQ7XG4gICAgdHM6IG51bWJlcjtcbiAgICByZW1hcms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3lzdGVtTWVzc2FnZUZyb20ge1xuICAgIGNvbnRlbnQ6IENvbnRlbnQ7XG4gICAgdHM6IG51bWJlcjtcbiAgICByZW1hcms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3lzdGVtTWVzc2FnZVRvIHtcbiAgICBwdXNoPzogUHVzaFNldHRpbmdzO1xuICAgIGNvbnRlbnQ6IENvbnRlbnQ7XG4gICAgcmVtYXJrPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFlvdXJzZWxmTWVzc2FnZUZyb20ge1xuICAgIHRvOiB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIHR5cGU/OiBSZWNlaXZlcjtcbiAgICB9O1xuICAgIGNvbnRlbnQ6IENvbnRlbnQ7XG4gICAgdHM6IG51bWJlcjtcbiAgICByZW1hcms/OiBzdHJpbmc7XG59Il19
