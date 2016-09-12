/*
 <script src="../node_modules/blueimp-md5/js/md5.js"></script>
 <script src="../node_modules/lodash/lodash.js"></script>
 <script src="../node_modules/whatwg-fetch/fetch.js"></script>
 <script src="../node_modules/socket.io-client/socket.io.js"></script>

 */

require.config({
    baseUrl: '../lib',
    paths: {
        'crypto-js': '../node_modules/crypto-js/crypto-js',
        lodash: '../node_modules/lodash/lodash',
        fetch: '../node_modules/whatwg-fetch/fetch'
    }
});


require.config({
    baseUrl: '../lib'
});
require(['index']);