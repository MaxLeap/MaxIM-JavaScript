(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../im'], factory);
    }
})(function (require, exports) {
    "use strict";
    var IM = require('../im');
    var im = IM({
        app: '56a86320e9db7300015438f7',
        key: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
        region: 'uat'
    });
    im.admin().search().forUsers(function (err, users) {
        for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
            var user = users_1[_i];
            console.log('=> user: %s', JSON.stringify(user));
        }
    });
});
