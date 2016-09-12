import {login} from "./service/session";
import {APIOptions} from "./service/common";


let me = 'foo';
let apiOptions: APIOptions = {
    server: 'http://imuat.maxleap.cn',
    app: '56a86320e9db7300015438f7',
    sign: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
    headers: {
        'x-ml-appid': this.app,
        'x-ml-apikey': this.sign
    }
};

/*
 let context = new Context(c.server, c.app, c.sign, 'foo');

 context
 .listFriends((err, friends) => {
 console.log('friends: %O', friends);
 })
 .listGroups((err, groups) => {
 console.log('groups: %O', groups);
 })
 .listRooms((err, rooms) => {
 console.log('rooms: %O', rooms);
 });
 */

login(apiOptions).simple(me).ok((err, session) => {
    if (err) {
        console.error('login failed');
    } else {
        console.log('login success');
        let fn = () => {
            console.log('speak success @ %d', _.now());
        };
        session
            .say('hello bar~~~~').toFriend('bar').ok(fn)
            .say('hello bar2~~~~').toFriend('bar').ok(fn);

    }
});