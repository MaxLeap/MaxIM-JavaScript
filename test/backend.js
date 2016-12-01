'use strict';

const IM = require('../lib/im.js');

let config = {
    app: '56a86320e9db7300015438f7',
    key: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
    region: 'test',
    useHttp: true
};

IM(config)
    .login()
    .simple('foo')
    .ok((err, session, context) => {
        if (err) {
            console.log('error');
        } else {
            context.listFriends((err, friends) => {
                if (err) {
                    console.log('error get friends.');
                } else {
                    friends.forEach(friend => {
                        console.log(friend);
                    });
                }
            });
            console.log('success');
        }
    });
