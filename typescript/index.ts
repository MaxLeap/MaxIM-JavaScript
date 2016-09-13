import {login} from "./service/session";
import {APIOptions} from "./service/common";
import {Context} from "./service/context";
import {AdminImpl} from "./service/admin";


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

login(apiOptions)
    .simple(me)
    .onFriendMessage((friendid, msg) => {
        console.log('from friend %s: %O', friendid, msg);
    })
    .onGroupMessage((groupid, userid, msg) => {
        console.log('from %s in group %s: %O', userid, groupid, msg);
    })
    .onRoomMessage((roomid, userid, msg) => {
        console.log('from %s in room %s: %O', userid, roomid, msg);
    })
    .onYourself(msg => {
        console.log('yourself message: %s', JSON.stringify(msg));
    })
    .ok((err, session) => {
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


let context = new Context(apiOptions.server, apiOptions.app, apiOptions.sign, 'foo');
context
    .getMyAttributes((err, attrs) => {
        console.log('MY ATTRIBUTES: %O', attrs);
    })
    .listFriends((err, friends) => {
        console.log('friends: %O', friends);
    })
    .listGroups((err, groups) => {
        console.log('groups: %O', groups);
    })
    .listRooms((err, rooms) => {
        console.log('rooms: %O', rooms);
    })
    .listTalkings()
    .ofFriend('bar', (err, records) => {
        console.log('records: %s', JSON.stringify(records));
    });


let admin = new AdminImpl(apiOptions.server, apiOptions.app, apiOptions.sign);

admin.say(`SYSTEM MESSAGE WAHAHA @ ${new Date()}`, 'REMARK!!!!').toAll().ok();

setInterval(() => {
    admin.say(`SYSTEM MESSAGE WAHAHA @ ${new Date()}`, 'REMARK!!!!').toAll().ok();
}, 30000);
