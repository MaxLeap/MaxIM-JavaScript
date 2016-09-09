import {Context} from "./service/context";
const TEST_RES = {
    server: 'http://imuat.maxleap.cn',
    app: '56a86320e9db7300015438f7',
    sign: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
    me: 'foo'
};

let context = new Context(TEST_RES.server, TEST_RES.app, TEST_RES.sign, 'foo');

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
