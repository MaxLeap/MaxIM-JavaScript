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
    .onAck((ack, ts) => {
        console.log("rcv ack: ack=%d, ts=%d.", ack, ts);
    })
    .ok((err, session, context) => {
        if (err) {
            console.log('error');
            return;
        }
        context.listFriends((err, friends) => {
            if (err) {
                console.log('error get friends.');
                return;
            }
            friends.forEach(friend => {
                console.log(friend);
            });
            session.say("fuck you!").ack(12345).asText().toFriend(friends[0].id).ok()
        });
        console.log('success');
    });
