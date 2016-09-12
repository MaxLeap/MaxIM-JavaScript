import {Callback, APIOptions} from "./common";
import {Media, MessageTo, PushSettings, Receiver} from "../messages";
import Socket = SocketIOClient.Socket;

interface Say {
    asText(): Say;
    asImage(): Say;
    asAudio(): Say;
    asVideo(): Say;

    disablePush(): Say;
    setPushSound(sound: string): Say;
    setPushBadge(badge: number): Say;
    setPushContentAvailable(contentAvailable: boolean): Say;
    setPushPrefix(prefix: string): Say;
    setPushSuffix(suffix: string): Say;
    setPushTextOverwrite(text: string): Say;

    toFriend(friend: string): Say2;
    toGroup(groupid: string): Say2;
    toRoom(roomid: string): Say2;
    toPassenger(passengerid: string): Say2;
    toStranger(strangerid: string): Say2;
}

interface Say2 {
    ok(callback?: Callback<void>): Session;
}

interface Session {
    //TODO
    say(text: string, remark?: string): Say;
    close(callback?: Callback<void>): void;
}

interface Login {
    simple(userid: string): LoginBuilder;
    byMaxleapUser(username: string, password: string): LoginBuilder;
    byPhone(phone: string, verify: string): LoginBuilder;
}

interface LoginBuilder {
    setNotifyAll(enable: boolean): LoginBuilder;
    setInstallation(installation: string): LoginBuilder;
    ok(callback: Callback<Session>);
}

class SayImpl implements Say {

    message: MessageTo;
    session: SessionImpl;

    constructor(session: SessionImpl, text: string, remark?: string) {
        this.session = session;
        this.message = {
            to: {
                id: null
            },
            content: {
                media: Media.TEXT,
                body: text
            }
        };

        if (remark) {
            this.message.remark = remark;
        }
    }

    asText(): Say {
        this.message.content.media = Media.TEXT;
        return this;
    }

    asImage(): Say {
        this.message.content.media = Media.IMAGE;
        return this;
    }

    asAudio(): Say {
        this.message.content.media = Media.AUDIO;
        return this;
    }

    asVideo(): Say {
        this.message.content.media = Media.VIDEO;
        return this;
    }

    private createPushIfNotExist(): PushSettings {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    }

    disablePush(): Say {
        this.createPushIfNotExist().enable = false;
        return this;
    }

    setPushSound(sound: string): Say {
        this.createPushIfNotExist().sound = sound;
        return this;
    }

    setPushBadge(badge: number): Say {
        this.createPushIfNotExist().badge = badge;
        return this;
    }

    setPushContentAvailable(contentAvailable: boolean): Say {
        this.createPushIfNotExist().contentAvailable = contentAvailable;
        return this;
    }

    setPushPrefix(prefix: string): Say {
        this.createPushIfNotExist().prefix = prefix;
        return this;
    }

    setPushSuffix(suffix: string): Say {
        this.createPushIfNotExist().suffix = suffix;
        return this;
    }

    setPushTextOverwrite(text: string): Say {
        this.createPushIfNotExist().overwrite = text;
        return this;
    }

    toFriend(friend: string): Say2 {
        this.message.to.id = friend;
        this.message.to.type = Receiver.ACTOR;
        return new SayBuilder(this.session, this.message);
    }

    toGroup(groupid: string): Say2 {
        this.message.to.id = groupid;
        this.message.to.type = Receiver.GROUP;
        return new SayBuilder(this.session, this.message);
    }

    toRoom(roomid: string): Say2 {
        this.message.to.id = roomid;
        this.message.to.type = Receiver.ROOM;
        return new SayBuilder(this.session, this.message);
    }

    toPassenger(passengerid: string): Say2 {
        this.message.to.id = passengerid;
        this.message.to.type = Receiver.PASSENGER;
        return new SayBuilder(this.session, this.message);
    }

    toStranger(strangerid: string): Say2 {
        this.message.to.id = strangerid;
        this.message.to.type = Receiver.STRANGER;
        return new SayBuilder(this.session, this.message);
    }

}

class SayBuilder implements Say2 {

    session: SessionImpl;
    message: MessageTo;

    constructor(session: SessionImpl, message: MessageTo) {
        this.session = session;
        this.message = message;
    }

    ok(callback?: Callback<void>): Session {
        this.session.socket.emit('say', this.message);
        return this.session;
    }

}

class LoginBuilderImpl implements LoginBuilder {

    private apiOptions: APIOptions;
    private authdata: {};

    constructor(apiOptions: APIOptions, authdata: {}) {
        this.apiOptions = apiOptions;
        this.authdata = authdata;
    }

    setNotifyAll(enable: boolean): LoginBuilder {
        _.extend(this.authdata, {notifyAll: enable});
        return this;
    }

    setInstallation(installation: string): LoginBuilder {
        _.extend(this.authdata, {install: installation});
        return this;
    }

    ok(callback: Callback<Session>) {
        let url = `${this.apiOptions.server}/chat`;
        let socket = io.connect(url, {
            query: `auth=${JSON.stringify(this.authdata)}`,
            transports: ['websocket']
        });
        socket.once('login', result => {
            let foo = result as LoginResult;
            if (foo.success) {
                callback(null, new SessionImpl(socket));
            } else {
                callback(new Error(`error: ${foo.error}`));
            }
        });
    }
}

class LoginImpl implements Login {

    private apiOptions: APIOptions;
    private basicAuth: {};

    constructor(apiOptions: APIOptions) {
        this.apiOptions = apiOptions;
        let foo = _.now();
        let bar = CryptoJS.MD5(`${foo}${this.apiOptions.sign}`).toString() + ',' + foo;
        this.basicAuth = {
            app: this.apiOptions.app,
            sign: bar
        }
    }

    simple(userid: string): LoginBuilder {
        let authdata = _.extend({client: userid}, this.basicAuth);
        return new LoginBuilderImpl(this.apiOptions, authdata);
    }

    byMaxleapUser(username: string, password: string) {
        let authdata = {
            username: username,
            password: password
        };
        _.extend(authdata, this.basicAuth);
        return new LoginBuilderImpl(this.apiOptions, authdata);
    }

    byPhone(phone: string, verify: string) {
        let authdata = {
            phone: phone,
            password: verify
        };
        _.extend(authdata, this.basicAuth);
        return new LoginBuilderImpl(this.apiOptions, authdata);
    }
}

class SessionImpl implements Session {
    private closed: boolean;
    socket: Socket;

    constructor(socket: Socket) {
        this.closed = false;
        this.socket = socket;
    }

    say(text: string, remark?: string): Say {
        if (this.closed) {
            throw new Error('session is closed.');
        }
        return new SayImpl(this, text, remark);
    }

    close(callback?: Callback<void>): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
        this.socket.close();
    }

}

interface LoginResult {
    success: boolean;
    id?: string;
    error?: number;
}

export function login(apiOptions: APIOptions): Login {
    return new LoginImpl(apiOptions);
}