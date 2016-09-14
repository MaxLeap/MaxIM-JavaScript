require.config({
    baseUrl: '../lib'
});
require(['index'], function () {
    "use strict";

    var config = {
        app: '56a86320e9db7300015438f7',
        key: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
        region: 'uat',
        useHttp: true
    };
    var im = ML.im(config);
    im.login().simple('foo').ok(function (err, session, context) {
        if (err) {
            console.error('login failed: %s', err);
        } else {

            context.listFriends(function (err, friends) {
                _.each(friends, function (friend) {
                    console.log('>>> [ %s ] - [ %s ]', friend.id, friend.online ? 'ONLLINE' : 'OFFLINE');
                });
            });

            setInterval(function () {
                session.say('hello @' + new Date()).toFriend('bar').ok();
            }, 10000);


            console.log('welcome %s!', session.current());
        }
    });
});