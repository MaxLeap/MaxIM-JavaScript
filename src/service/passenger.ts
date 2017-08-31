import io = require("socket.io-client");
import {md5} from "../helper/md5";
import {convert2basic, ParrotError} from "../helper/utils";
import {BasicMessageFrom, Media, MessageFrom, MessageTo, PushSettings, Receiver} from "../model/messages";
import {APIOptions, Attributes, Callback, Callback2, Handler1, Handler2, LoginResult} from "../model/models";
import {CommonService, CommonServiceImpl} from "./common";
import Socket = SocketIOClient.Socket;

interface PassengerBuilder {
  attribute(name: string, value: any): PassengerBuilder;

  onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder;

  onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder;

  onStrangerOnline(callback: Handler1<string>): PassengerBuilder;

  onStrangerOffline(callback: Handler1<string>): PassengerBuilder;

  ok(callback: Callback2<PassengerSession, PassengerContext>);
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

  public message: MessageTo;
  public session: PassengerSessionImpl;

  constructor(session: PassengerSessionImpl, text: string, remark?: string) {
    this.session = session;
    this.message = {
      to: {
        id: null,
      },
      content: {
        media: Media.TEXT,
        body: text,
      },
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

  public disablePush(): MessageBuilder {
    this.createPushIfNotExist().enable = false;
    return this;
  }

  public setPushSound(sound: string): MessageBuilder {
    this.createPushIfNotExist().sound = sound;
    return this;
  }

  public setPushBadge(badge: number): MessageBuilder {
    this.createPushIfNotExist().badge = badge;
    return this;
  }

  public setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
    this.createPushIfNotExist().contentAvailable = contentAvailable;
    return this;
  }

  public setPushPrefix(prefix: string): MessageBuilder {
    this.createPushIfNotExist().prefix = prefix;
    return this;
  }

  public setPushSuffix(suffix: string): MessageBuilder {
    this.createPushIfNotExist().suffix = suffix;
    return this;
  }

  public setPushTextOverwrite(text: string): MessageBuilder {
    this.createPushIfNotExist().overwrite = text;
    return this;
  }

  public asText(): MessageBuilder {
    this.message.content.media = Media.TEXT;
    return this;
  }

  public asImage(): MessageBuilder {
    this.message.content.media = Media.IMAGE;
    return this;
  }

  public asAudio(): MessageBuilder {
    this.message.content.media = Media.AUDIO;
    return this;
  }

  public asVideo(): MessageBuilder {
    this.message.content.media = Media.VIDEO;
    return this;
  }

  public toUser(userid: string): MessageLauncher {
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

  public ok(callback?: Callback<void>): PassengerSession {
    try {
      this._session._socket.emit("say", this._message);
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

  public _socket: Socket;
  public _id: string;

  private _closed: boolean;

  constructor(socket: Socket, passengerid: string) {
    this._socket = socket;
    this._id = passengerid;
  }

  public say(text: string, remark?: string): MessageBuilder {
    return new MessageBuilderImpl(this, text, remark);
  }

  public close(callback?: Callback<void>) {
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

  public current(): string {
    return this._you;
  }

}

class PassengerBuilderImpl implements PassengerBuilder {

  private _id: string;
  private _options: APIOptions;
  private _attributes: Attributes = [];
  private _fromuser: Array<Handler2<string, BasicMessageFrom>> = [];
  private _fromsystem: Array<Handler1<BasicMessageFrom>> = [];
  private _fromStrangerOnline: Array<Handler1<string>> = [];
  private _fromStrangerOffline: Array<Handler1<string>> = [];

  constructor(options: APIOptions, id?: string) {
    this._options = options;
    this._id = id;
  }

  public attribute(name: string, value: any): PassengerBuilder {
    this._attributes[name] = value;
    return this;
  }

  public onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder {
    this._fromuser.push(callback);
    return this;
  }

  public onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder {
    this._fromsystem.push(callback);
    return this;
  }

  public onStrangerOnline(callback: Handler1<string>): PassengerBuilder {
    this._fromStrangerOnline.push(callback);
    return this;
  }

  public onStrangerOffline(callback: Handler1<string>): PassengerBuilder {
    this._fromStrangerOffline.push(callback);
    return this;
  }

  public ok(callback: Callback2<PassengerSession, PassengerContext>) {
    const url = `${this._options.server}/chat`;

    const foo = new Date().getTime();
    const bar = md5(`${foo}${this._options.sign}`) + "," + foo;
    const authdata = {
      app: this._options.app,
      sign: bar,
      passenger: {},
    };

    for (const k in this._attributes) {
      if (k === "id") {
        continue;
      }
      authdata.passenger[k] = this._attributes[k];
    }

    if (this._id) {
      authdata.passenger.id = this._id;
    }

    const socket = io.connect(url, {
      query: `auth=${JSON.stringify(authdata)}`,
      transports: ["websocket"],
    });
    socket.once("login", (result) => {
      const foo = result as LoginResult;
      if (foo.success) {
        const session = new PassengerSessionImpl(socket, foo.id);
        const ctx = new PassengerContextImpl(this._options, foo.id);
        callback(null, session, ctx);
      } else {
        const err = new ParrotError({errorCode: foo.error, errorMessage: ""});
        callback(err);
      }
    });

    socket.on("message", (income) => {
      const msg = income as MessageFrom;
      const basicmsg = convert2basic(msg);

      switch (msg.from.type) {
        case Receiver.ACTOR:
          for (const handler of this._fromuser) {
            handler(msg.from.id, basicmsg);
          }
          break;
        default:
          break;
      }
    });

    socket.on("online_x", (onlineid) => {
      for (const handler of this._fromStrangerOnline) {
        handler(onlineid as string);
      }
    });

    socket.on("offline_x", (offlineid) => {
      for (const handler of this._fromStrangerOffline) {
        handler(offlineid as string);
      }
    });

    socket.on("sys", (income) => {
      const msg = income as BasicMessageFrom;
      for (const handler of this._fromsystem) {
        handler(msg);
      }
    });
  }
}

export {
  PassengerBuilder,
  PassengerBuilderImpl,
};
