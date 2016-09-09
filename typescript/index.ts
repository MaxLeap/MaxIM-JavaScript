import _ = require('lodash');
import socketio = require('socket.io-client');
import {Management} from "./management";

let management = new Management('http://imuat.maxleap.cn', '56a86320e9db7300015438f7', 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw', 'foo');

management.userInfo('foo', (err, user) => {
    if (err) {
        console.error('error: %s', err);
    } else {
        console.info('user info: %O', user);
    }
});