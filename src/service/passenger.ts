import io = require("socket.io-client");
import Socket = SocketIOClient.Socket;
import {md5} from "../helper/md5";
import {convert2basic, ParrotError} from "../helper/utils";
import {BasicMessageFrom, Media, MessageFrom, MessageTo, PushSettings, Receiver} from "../model/messages";
import {APIOptions, Attributes, Callback, Callback2, Handler1, Handler2, LoginResult} from "../model/models";
import {CommonService, CommonServiceImpl} from "./common";

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

  private createPushIfNotExist(): PushSettings {
    if (!this.message.push) {
      this.message.push = {};
    }
    return this.message.push;
  }

}

class MessageLauncherImpl implements MessageLauncher {

  private session: PassengerSessionImpl;
  private msg: MessageTo;

  constructor(session: PassengerSessionImpl, message: MessageTo) {
    this.session = session;
    this.msg = message;
  }

  public ok(callback?: Callback<void>): PassengerSession {
    try {
      this.session.socket.emit("say", this.msg);
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

class PassengerSessionImpl implements PassengerSession {

  public socket: Socket;
  public id: string;
  private closed: boolean;

  constructor(socket: Socket, passengerid: string) {
    this.socket = socket;
    this.id = passengerid;
  }

  public say(text: string, remark?: string): MessageBuilder {
    return new MessageBuilderImpl(this, text, remark);
  }

  public close(callback?: Callback<void>) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.socket.close();
  }

}

class PassengerContextImpl extends CommonServiceImpl implements PassengerContext {

  private you: string;

  constructor(options: APIOptions, you: string) {
    super(options);
    this.you = you;
  }

  public current(): string {
    return this.you;
  }

}

class PassengerBuilderImpl implements PassengerBuilder {

  private id: string;
  private options: APIOptions;
  private attributes: Attributes = [];
  private fromUser: Array<Handler2<string, BasicMessageFrom>> = [];
  private fromSystem: Array<Handler1<BasicMessageFrom>> = [];
  private fromStrangerOnline: Array<Handler1<string>> = [];
  private fromStrangerOffline: Array<Handler1<string>> = [];

  constructor(options: APIOptions, id?: string) {
    this.options = options;
    this.id = id;
  }

  public attribute(name: string, value: any): PassengerBuilder {
    this.attributes[name] = value;
    return this;
  }

  public onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder {
    this.fromUser.push(callback);
    return this;
  }

  public onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder {
    this.fromSystem.push(callback);
    return this;
  }

  public onStrangerOnline(callback: Handler1<string>): PassengerBuilder {
    this.fromStrangerOnline.push(callback);
    return this;
  }

  public onStrangerOffline(callback: Handler1<string>): PassengerBuilder {
    this.fromStrangerOffline.push(callback);
    return this;
  }

  public ok(callback: Callback2<PassengerSession, PassengerContext>) {
    const url = `${this.options.server}/chat`;

    const foo = new Date().getTime();
    const bar = md5(`${foo}${this.options.sign}`) + "," + foo;
    const authdata = {
      app: this.options.app,
      sign: bar,
      passenger: {},
    };

    for (const k in this.attributes) {
      if (k === "id") {
        continue;
      }
      authdata.passenger[k] = this.attributes[k];
    }

    if (this.id) {
      authdata.passenger.id = this.id;
    }

    const socket = io.connect(url, {
      query: `auth=${JSON.stringify(authdata)}`,
      transports: ["websocket"],
    });
    socket.once("login", (result) => {
      const foo = result as LoginResult;
      if (foo.success) {
        const session = new PassengerSessionImpl(socket, foo.id);
        const ctx = new PassengerContextImpl(this.options, foo.id);
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
          for (const handler of this.fromUser) {
            handler(msg.from.id, basicmsg);
          }
          break;
        default:
          break;
      }
    });

    socket.on("online_x", (onlineid) => {
      for (const handler of this.fromStrangerOnline) {
        handler(onlineid as string);
      }
    });

    socket.on("offline_x", (offlineid) => {
      for (const handler of this.fromStrangerOffline) {
        handler(offlineid as string);
      }
    });

    socket.on("sys", (income) => {
      const msg = income as BasicMessageFrom;
      for (const handler of this.fromSystem) {
        handler(msg);
      }
    });
  }
}

export {
  PassengerBuilder,
  PassengerBuilderImpl,
};
