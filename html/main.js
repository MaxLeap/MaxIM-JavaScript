require.config({
    baseUrl: '../lib'
});
require(['index'], function (index) {
    "use strict";
    console.log(index);
});