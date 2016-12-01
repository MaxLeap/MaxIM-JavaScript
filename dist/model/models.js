(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var APIOptions = (function () {
        function APIOptions(server, app, sign) {
            this.server = server;
            this.app = app;
            this.sign = sign;
            this.headers = {
                'x-ml-appid': app,
                'x-ml-apikey': sign,
                'content-type': 'application/json; charset=utf-8'
            };
        }
        return APIOptions;
    }());
    exports.APIOptions = APIOptions;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC9tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0lBMERBO1FBTUksb0JBQVksTUFBYyxFQUFFLEdBQVcsRUFBRSxJQUFZO1lBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRztnQkFDWCxZQUFZLEVBQUUsR0FBRztnQkFDakIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLGNBQWMsRUFBRSxpQ0FBaUM7YUFDcEQsQ0FBQztRQUNOLENBQUM7UUFDTCxpQkFBQztJQUFELENBaEJBLEFBZ0JDLElBQUE7SUFoQlksa0JBQVUsYUFnQnRCLENBQUEiLCJmaWxlIjoibW9kZWwvbW9kZWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb250ZW50fSBmcm9tIFwiLi9tZXNzYWdlc1wiO1xuZXhwb3J0IGludGVyZmFjZSBVc2VyRGV0YWlsIHtcbiAgICBzZXNzaW9uczogbnVtYmVyO1xuICAgIHRzOiBudW1iZXI7XG4gICAgcm9vbXM/OiBzdHJpbmdbXTtcbiAgICBncm91cHM/OiBzdHJpbmdbXTtcbiAgICBpbnN0YWxscz86IHN0cmluZ1tdO1xuICAgIGZyaWVuZHM/OiBzdHJpbmdbXTtcbiAgICBhdHRyaWJ1dGVzPzoge1trZXk6IHN0cmluZ106IGFueX07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlck91dGxpbmUge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgb25saW5lOiBib29sZWFuO1xuICAgIHRzOiBudW1iZXI7XG4gICAgYXR0cmlidXRlcz86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwSW5mbyB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBvd25lcjogc3RyaW5nO1xuICAgIG1lbWJlcnM6IHN0cmluZ1tdO1xuICAgIHRzOiBudW1iZXI7XG4gICAgYXR0cmlidXRlcz86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE15R3JvdXAgZXh0ZW5kcyBHcm91cEluZm8ge1xuICAgIHJlY2VudD86IENoYXRSZWNvcmQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm9vbUluZm8ge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWVtYmVyczogc3RyaW5nW107XG4gICAgdHM6IG51bWJlcjtcbiAgICBhdHRyaWJ1dGVzPzoge1trZXk6IHN0cmluZ106IGFueX07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhdFJlY29yZCB7XG4gICAgc3BlYWtlcjogc3RyaW5nO1xuICAgIGNvbnRlbnQ6IENvbnRlbnQ7XG4gICAgdHM6IG51bWJlcjtcbiAgICByZW1hcms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRnJpZW5kIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG9ubGluZTogYm9vbGVhbjtcbiAgICByZWNlbnQ/OiBDaGF0UmVjb3JkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhc3NlbmdlciB7XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF0dHJpYnV0ZXMge1xuICAgIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEFQSU9wdGlvbnMge1xuICAgIHNlcnZlcjogc3RyaW5nO1xuICAgIGFwcDogc3RyaW5nO1xuICAgIHNpZ246IHN0cmluZztcbiAgICBoZWFkZXJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcblxuICAgIGNvbnN0cnVjdG9yKHNlcnZlcjogc3RyaW5nLCBhcHA6IHN0cmluZywgc2lnbjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5zaWduID0gc2lnbjtcbiAgICAgICAgdGhpcy5oZWFkZXJzID0ge1xuICAgICAgICAgICAgJ3gtbWwtYXBwaWQnOiBhcHAsXG4gICAgICAgICAgICAneC1tbC1hcGlrZXknOiBzaWduLFxuICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBIYW5kbGVyMTxUPiB7XG4gICAgKHQ/OiBUKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIYW5kbGVyMjxULFU+IHtcbiAgICAodD86IFQsIHU/OiBVKTogdm9pZDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSGFuZGxlcjM8VCxVLFY+IHtcbiAgICAodD86IFQsIHU/OiBVLCB2PzogVik6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsbGJhY2s8VD4gZXh0ZW5kcyBIYW5kbGVyMjxFcnJvcixUPiB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsbGJhY2syPFQsVT4gZXh0ZW5kcyBIYW5kbGVyMzxFcnJvcixULFU+IHtcblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvZ2luUmVzdWx0IHtcbiAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgIGlkPzogc3RyaW5nO1xuICAgIGVycm9yPzogbnVtYmVyO1xufVxuXG5cbiJdfQ==
