import {Admin, AdminImpl} from "./service/admin";
import {Login, LoginImpl} from "./service/login";
import {APIOptions} from "./models";

const MAXLEAP_ROOT = 'ML';

interface MaxIMOptions {
    app: string;
    key: string;
    region?: string;
    useHttp?: boolean;
}

interface MaxIM {
    /**
     * 登录
     */
    login(): Login;
    /**
     * 获取管理接口
     */
    admin(): Admin;
}

class MaxIMImpl implements MaxIM {
    private _options: APIOptions;
    private _admin: Admin;

    constructor(options: MaxIMOptions) {
        if (!options || !options.app || !options.key) {
            throw new Error(`invalid options: ${JSON.stringify(options)}`);
        }

        let server: string, protocol: string = options.useHttp ? 'http://' : 'https://';
        switch ((options.region || 'cn').toLowerCase()) {
            case 'us':
                server = 'im.maxleap.com';
                break;
            case 'cn':
                server = 'im.maxleap.cn';
                break;
            case 'uat':
                server = 'imuat.maxleap.cn';
                break;
            default:
                throw new Error(`invalid region ${options.region}`);
        }
        this._options = new APIOptions(`${protocol}${server}`, options.app, options.key);
        this._admin = new AdminImpl(this._options);
    }

    login(): Login {
        return new LoginImpl(this._options);
    }

    admin(): Admin {
        return this._admin;
    }
}

function _initialize(options: MaxIMOptions): MaxIM {
    return new MaxIMImpl(options);
}


if (window) {
    if (!window[MAXLEAP_ROOT]) {
        window[MAXLEAP_ROOT] = {};
    }
    _.extend(window[MAXLEAP_ROOT], {im: _initialize});
}

export default _initialize;

/*

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


 let context = new ContextImpl(apiOptions.server, apiOptions.app, apiOptions.sign, 'foo');
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

 */