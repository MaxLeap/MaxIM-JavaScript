import {Callback2, Attributes, APIOptions, Handler2, Handler1, LoginResult, Callback} from "../model/models";
import {BasicMessageFrom, MessageTo, Media, MessageFrom, Receiver, PushSettings} from "../model/messages";
import {md5} from "../helper/md5";
import {CommonService, CommonServiceImpl} from "./common";
import {ParrotError, convert2basic} from "../helper/utils";
import io = require('socket.io-client');
import Socket = SocketIOClient.Socket;


interface PassengerBuilder {
    attribute(name: string, value: any): PassengerBuilder;
    onUserMessage(callback: Handler2<string,BasicMessageFrom>): PassengerBuilder;
    onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder;
    onStrangerOnline(callback: Handler1<string>): PassengerBuilder;
    onStrangerOffline(callback: Handler1<string>): PassengerBuilder;
    ok(callback: Callback2<PassengerSession,PassengerContext>);
}

interface PassengerSession {
    say(text: string, remark?: string): MessageBuilder;
    close(callback?: Callback<void>);
}


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

    toUser(userid: string): MessageLauncher;
}

interface MessageLauncher {
    ok(callback?: Callback<void>): PassengerSession;
}

interface PassengerContext extends CommonService {

    current(): string;

}

class MessageBuilderImpl implements MessageBuilder {

    message: MessageTo;
    session: PassengerSessionImpl;

    constructor(session: PassengerSessionImpl, text: string, remark?: string) {
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

    toUser(userid: string): MessageLauncher {
        this.message.to.id = userid;
        return new MessageLauncherImpl(this.session, this.message);
    }

}

class MessageLauncherImpl implements MessageLauncher {

    private _session: PassengerSessionImpl;
    private _message: MessageTo;

    constructor(session: PassengerSessionImpl, message: MessageTo) {
        this._session = session;
        this._message = message;
    }

    ok(callback?: Callback<void>): PassengerSession {
        try {
            this._session._socket.emit('say', this._message);
            if (callback) {
                callback(null, null);
            }
        } catch (e) {
            if (callback) {
                callback(e);
            }
        }
        return this._session;
    }
}


class PassengerSessionImpl implements PassengerSession {

    _socket: Socket;
    _id: string;

    private _closed: boolean;

    constructor(socket: Socket, passengerid: string) {
        this._socket = socket;
        this._id = passengerid;
    }

    say(text: string, remark?: string): MessageBuilder {
        return new MessageBuilderImpl(this, text, remark);
    }

    close(callback?: Callback<void>) {
        if (this._closed) {
            return;
        }
        this._closed = true;
        this._socket.close();
    }

}

class PassengerContextImpl extends CommonServiceImpl implements PassengerContext {

    private _you: string;

    constructor(options: APIOptions, you: string) {
        super(options);
        this._you = you;
    }

    current(): string {
        return this._you;
    }

}

class PassengerBuilderImpl implements PassengerBuilder {

    private _id: string;
    private _options: APIOptions;
    private _attributes: Attributes = [];
    private _fromuser: Handler2<string,BasicMessageFrom>[] = [];
    private _fromsystem: Handler1<BasicMessageFrom>[] = [];
    private _fromStrangerOnline: Handler1<string>[] = [];
    private _fromStrangerOffline: Handler1<string>[] = [];

    constructor(options: APIOptions, id?: string) {
        this._options = options;
        this._id = id;
    }

    attribute(name: string, value: any): PassengerBuilder {
        this._attributes[name] = value;
        return this;
    }

    onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder {
        this._fromuser.push(callback);
        return this;
    }

    onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder {
        this._fromsystem.push(callback);
        return this;
    }

    onStrangerOnline(callback: Handler1<string>): PassengerBuilder {
        this._fromStrangerOnline.push(callback);
        return this;
    }

    onStrangerOffline(callback: Handler1<string>): PassengerBuilder {
        this._fromStrangerOffline.push(callback);
        return this;
    }

    ok(callback: Callback2<PassengerSession, PassengerContext>) {
        let url = `${this._options.server}/chat`;

        let foo = new Date().getTime();
        let bar = md5(`${foo}${this._options.sign}`) + ',' + foo;
        let authdata = {
            app: this._options.app,
            sign: bar,
            passenger: {}
        };

        for (let k in this._attributes) {
            if (k === 'id') {
                continue;
            }
            authdata.passenger[k] = this._attributes[k];
        }

        if (this._id) {
            authdata.passenger['id'] = this._id;
        }

        let socket = io.connect(url, {
            query: `auth=${JSON.stringify(authdata)}`,
            transports: ['websocket']
        });
        socket.once('login', result => {
            let foo = result as LoginResult;
            if (foo.success) {
                let session = new PassengerSessionImpl(socket, foo.id);
                let ctx = new PassengerContextImpl(this._options, foo.id);
                callback(null, session, ctx);
            } else {
                let err = new ParrotError({errorCode: foo.error, errorMessage: ''});
                callback(err);
            }
        });

        socket.on('message', income=> {
            let msg = income as MessageFrom;
            let basicmsg = convert2basic(msg);

            switch (msg.from.type) {
                case Receiver.ACTOR:
                    for (let handler of this._fromuser) {
                        handler(msg.from.id, basicmsg);
                    }
                    break;
                default:
                    break;
            }
        });

        socket.on('online_x', onlineid => {
            for (let handler of this._fromStrangerOnline) {
                handler(onlineid as string);
            }
        });

        socket.on('offline_x', offlineid => {
            for (let handler of this._fromStrangerOffline) {
                handler(offlineid as string);
            }
        });

        socket.on('sys', income => {
            let msg = income as BasicMessageFrom;
            for (let handler of this._fromsystem) {
                handler(msg);
            }
        });
    }
}

export {
    PassengerBuilder,
    PassengerBuilderImpl
}