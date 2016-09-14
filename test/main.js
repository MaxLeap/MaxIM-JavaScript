require.config({
    paths: {
        'socket.io-client': '../bower_components/socket.io-client/socket.io',
        'fetch': '../bower_components/fetch/fetch',
        'isomorphic-fetch': '../bower_components/isomorphic-fetch/fetch-bower',
        'maxim': '../dist'
    }
});
require(['maxim/im'], function () {
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
            document.getElementById('upload').addEventListener('click', function (e) {
                let file = document.getElementById('attachment').files[0];
                context.attachment(file).ok(function (urls) {
                    console.log('upload success: %s', urls);
                });
            });

            context.listFriends(function (err, friends) {
                friends.forEach(function (friend) {
                    console.log('>>> [ %s ] - [ %s ]', friend.id, friend.online ? 'ONLLINE' : 'OFFLINE');
                });
            });

            setInterval(function () {
                session.say('hello @' + new Date().getTime()).toFriend('bar').ok();
            }, 10000);


            console.log('welcome %s!', session.current());
        }
    });
});