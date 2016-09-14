import {
    Media,
    MessageTo,
    PushSettings,
    Receiver,
    MessageFrom,
    YourselfMessageFrom,
    SystemMessageFrom,
    BasicMessageFrom
} from "../messages";
import {Context, ContextImpl} from "./context";
import {APIOptions, Handler2, Handler3, Handler1, Callback, Callback2} from "../models";
import io = require('socket.io-client');
import Socket = SocketIOClient.Socket;

interface MessageBuilder {
    asText(): MessageBuilder;
    asImage(): MessageBuilder;
    asAudio(): MessageBuilder;
    asVideo(): MessageBuilder;

    disablePush(): MessageBuilder;
    setPushSound(sound: string): MessageBuilder;
    setPushBadge(badge: number): MessageBuilder;
    setPushContentAvailable(contentAvailable: boolean): MessageBuilder;
    setPushPrefix(prefix: string): MessageBuilder;
    setPushSuffix(suffix: string): MessageBuilder;
    setPushTextOverwrite(text: string): MessageBuilder;

    toFriend(friend: string): MessageLauncher;
    toGroup(groupid: string): MessageLauncher;
    toRoom(roomid: string): MessageLauncher;
    toPassenger(passengerid: string): MessageLauncher;
    toStranger(strangerid: string): MessageLauncher;
}

interface MessageLauncher {
    ok(callback?: Callback<void>): Session;
}

interface LoginResult {
    success: boolean;
    id?: string;
    error?: number;
}


class MessageBuilder implements MessageBuilder {

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
        if (remark != null) {
            this.message.remark = remark;
        }
    }

    asText(): MessageBuilder {
        this.message.content.media = Media.TEXT;
        return this;
    }

    asImage(): MessageBuilder {
        this.message.content.media = Media.IMAGE;
        return this;
    }

    asAudio(): MessageBuilder {
        this.message.content.media = Media.AUDIO;
        return this;
    }

    asVideo(): MessageBuilder {
        this.message.content.media = Media.VIDEO;
        return this;
    }

    private createPushIfNotExist(): PushSettings {
        if (!this.message.push) {
            this.message.push = {};
        }
        return this.message.push;
    }

    disablePush(): MessageBuilder {
        this.createPushIfNotExist().enable = false;
        return this;
    }

    setPushSound(sound: string): MessageBuilder {
        this.createPushIfNotExist().sound = sound;
        return this;
    }

    setPushBadge(badge: number): MessageBuilder {
        this.createPushIfNotExist().badge = badge;
        return this;
    }

    setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
        this.createPushIfNotExist().contentAvailable = contentAvailable;
        return this;
    }

    setPushPrefix(prefix: string): MessageBuilder {
        this.createPushIfNotExist().prefix = prefix;
        return this;
    }

    setPushSuffix(suffix: string): MessageBuilder {
        this.createPushIfNotExist().suffix = suffix;
        return this;
    }

    setPushTextOverwrite(text: string): MessageBuilder {
        this.createPushIfNotExist().overwrite = text;
        return this;
    }

    toFriend(friend: string): MessageLauncher {
        this.message.to.id = friend;
        this.message.to.type = Receiver.ACTOR;
        return new SayBuilder(this.session, this.message);
    }

    toGroup(groupid: string): MessageLauncher {
        this.message.to.id = groupid;
        this.message.to.type = Receiver.GROUP;
        return new SayBuilder(this.session, this.message);
    }

    toRoom(roomid: string): MessageLauncher {
        this.message.to.id = roomid;
        this.message.to.type = Receiver.ROOM;
        return new SayBuilder(this.session, this.message);
    }

    toPassenger(passengerid: string): MessageLauncher {
        this.message.to.id = passengerid;
        this.message.to.type = Receiver.PASSENGER;
        return new SayBuilder(this.session, this.message);
    }

    toStranger(strangerid: string): MessageLauncher {
        this.message.to.id = strangerid;
        this.message.to.type = Receiver.STRANGER;
        return new SayBuilder(this.session, this.message);
    }

}

class SayBuilder implements MessageLauncher {

    session: SessionImpl;
    message: MessageTo;

    constructor(session: SessionImpl, message: MessageTo) {
        this.session = session;
        this.message = message;
    }

    ok(callback?: Callback<void>): Session {
        try {
            this.session.socket.emit('say', this.message);
            if (callback) {
                callback(null, null);
            }
        } catch (e) {
            if (callback) {
                callback(e);
            }
        }
        return this.session;
    }
}

export class SessionBuilderImpl implements SessionBuilder {

    private friends: Handler2<string,BasicMessageFrom>[];
    private groups: Handler3<string,string,BasicMessageFrom>[];
    private rooms: Handler3<string,string,BasicMessageFrom>[];
    private passengers: Handler2<string,BasicMessageFrom>[];
    private strangers: Handler2<string,BasicMessageFrom>[];
    private friendonlines: Handler1<string>[];
    private friendofflines: Handler1<string>[];
    private strangeronlineds: Handler1<string>[];
    private strangerofflines: Handler1<string>[];
    private systems: Handler1<SystemMessageFrom>[];
    private yourselfs: Handler1<YourselfMessageFrom>[];

    private apiOptions: APIOptions;
    private authdata: {};

    constructor(apiOptions: APIOptions, authdata: {}) {
        this.apiOptions = apiOptions;
        this.authdata = authdata;

        this.friends = [];
        this.groups = [];
        this.rooms = [];
        this.passengers = [];
        this.strangers = [];

        this.friendonlines = [];
        this.friendofflines = [];
        this.strangeronlineds = [];
        this.strangerofflines = [];
        this.systems = [];
        this.yourselfs = [];
    }

    setNotifyAll(enable: boolean): SessionBuilder {
        this.authdata['notifyAll'] = enable;
        return this;
    }

    setInstallation(installation: string): SessionBuilder {
        this.authdata['install'] = installation;
        return this;
    }

    onFriendMessage(handler: Handler2<string,BasicMessageFrom>): SessionBuilder {
        this.friends.push(handler);
        return this;
    }

    onGroupMessage(handler: Handler3<string,string,MessageFrom>): SessionBuilder {
        this.groups.push(handler);
        return this;
    }

    onRoomMessage(handler: Handler3<string,string,MessageFrom>): SessionBuilder {
        this.rooms.push(handler);
        return this;
    }

    onPassengerMessage(handler: Handler2<string,MessageFrom>): SessionBuilder {
        this.passengers.push(handler);
        return this;
    }

    onStrangerMessage(handler: Handler2<string,MessageFrom>): SessionBuilder {
        this.strangers.push(handler);
        return this;
    }

    onFriendOnline(handler: Handler1<string>): SessionBuilder {
        this.friendonlines.push(handler);
        return this;
    }

    onFriendOffline(handler: Handler1<string>): SessionBuilder {
        this.friendofflines.push(handler);
        return this;
    }

    onStrangerOnline(handler: Handler1<string>): SessionBuilder {
        this.strangeronlineds.push(handler);
        return this;
    }

    onStrangerOffline(handler: Handler1<string>): SessionBuilder {
        this.strangerofflines.push(handler);
        return this;
    }

    onSystemMessage(handler: Handler1<SystemMessageFrom>): SessionBuilder {
        this.systems.push(handler);
        return this;
    }

    onYourself(handler: Handler1<YourselfMessageFrom>): SessionBuilder {
        this.yourselfs.push(handler);
        return this;
    }

    private static convert(origin: MessageFrom): BasicMessageFrom {
        let ret: BasicMessageFrom = {
            content: origin.content,
            ts: origin.ts
        };
        if (origin.remark != null) {
            ret.remark = origin.remark;
        }
        return ret;
    }

    ok(callback: Callback2<Session,Context>) {
        let url = `${this.apiOptions.server}/chat`;
        let socket = io.connect(url, {
            query: `auth=${JSON.stringify(this.authdata)}`,
            transports: ['websocket']
        });
        socket.once('login', result => {
            let foo = result as LoginResult;
            if (foo.success) {
                let session = new SessionImpl(socket, foo.id);
                let ctx = new ContextImpl(this.apiOptions, result.id);
                callback(null, session, ctx);
            } else {
                callback(new Error(`error: ${foo.error}`), null, null);
            }
        });

        socket.on('message', income => {
            let msg = income as MessageFrom;
            let basicmsg = SessionBuilderImpl.convert(msg);
            switch (msg.from.type) {
                case Receiver.ACTOR:
                    for (let handler of this.friends) {
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                case Receiver.GROUP:
                    for (let handler of this.groups) {
                        handler(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case Receiver.ROOM:
                    for (let handler of this.rooms) {
                        handler(msg.from.gid, msg.from.id, basicmsg);
                    }
                    break;
                case Receiver.PASSENGER:
                    for (let handler of this.passengers) {
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                case Receiver.STRANGER:
                    for (let handler of this.strangers) {
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });

        socket.on('online', onlineid => {
            for (let handler of this.friendonlines) {
                handler(onlineid as string);
            }
        });

        socket.on('offline', offlineid=> {
            for (let handler of this.friendofflines) {
                handler(offlineid as string);
            }
        });

        socket.on('online_x', onlineid => {
            for (let handler of this.strangeronlineds) {
                handler(onlineid as string);
            }
        });

        socket.on('offline_x', offlineid => {
            for (let handler of this.strangerofflines) {
                handler(offlineid as string);
            }
        });

        socket.on('sys', income => {
            let msg = income as SystemMessageFrom;
            for (let handler of this.systems) {
                handler(msg);
            }
        });

        socket.on('yourself', income => {
            let msg = income as YourselfMessageFrom;
            for (let handler of this.yourselfs) {
                handler(msg);
            }
        });
    }
}

class SessionImpl implements Session {
    private closed: boolean;
    private userid: string;

    socket: Socket;

    constructor(socket: Socket, userid: string) {
        this.closed = false;
        this.socket = socket;
        this.userid = userid;
    }

    current(): string {
        return this.userid;
    }

    say(text: string, remark?: string): MessageBuilder {
        if (this.closed) {
            throw new Error('session is closed.');
        }
        return new MessageBuilder(this, text, remark);
    }

    close(callback?: Callback<void>): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
        this.socket.close();
    }

}

export interface Session {
    current(): string;
    say(text: string, remark?: string): MessageBuilder;
    close(callback?: Callback<void>): void;
}

export interface SessionBuilder {
    setNotifyAll(enable: boolean): SessionBuilder;
    setInstallation(installation: string): SessionBuilder;

    onFriendMessage(handler: Handler2<string,BasicMessageFrom>): SessionBuilder;
    onGroupMessage(handler: Handler3<string, string,BasicMessageFrom>): SessionBuilder;
    onRoomMessage(handler: Handler3<string,string,BasicMessageFrom>): SessionBuilder;
    onPassengerMessage(handler: Handler2<string,BasicMessageFrom>): SessionBuilder;
    onStrangerMessage(handler: Handler2<string,BasicMessageFrom>): SessionBuilder;
    onFriendOnline(handler: Handler1<string>): SessionBuilder;
    onFriendOffline(handler: Handler1<string>): SessionBuilder;
    onStrangerOnline(handler: Handler1<string>): SessionBuilder;
    onStrangerOffline(handler: Handler1<string>): SessionBuilder;
    onSystemMessage(handler: Handler1<SystemMessageFrom>): SessionBuilder;
    onYourself(handler: Handler1<YourselfMessageFrom>): SessionBuilder;

    ok(callback: Callback2<Session,Context>);
}
