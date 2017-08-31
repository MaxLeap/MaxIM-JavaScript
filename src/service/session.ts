import io = require("socket.io-client");
import {convert2basic} from "../helper/utils";
import {
  BasicMessageFrom,
  Media,
  MessageFrom,
  MessageTo,
  PushSettings,
  Receiver,
  SystemMessageFrom,
  YourselfMessageFrom,
} from "../model/messages";
import {APIOptions, Callback, Callback2, Handler1, Handler2, Handler3, LoginResult} from "../model/models";
import {Context, ContextImpl} from "./context";
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

class MessageBuilderImpl implements MessageBuilder {

  public message: MessageTo;
  public session: SessionImpl;

  constructor(session: SessionImpl, text: string, remark?: string) {
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

  public toFriend(friend: string): MessageLauncher {
    this.message.to.id = friend;
    this.message.to.type = Receiver.ACTOR;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toGroup(groupid: string): MessageLauncher {
    this.message.to.id = groupid;
    this.message.to.type = Receiver.GROUP;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toRoom(roomid: string): MessageLauncher {
    this.message.to.id = roomid;
    this.message.to.type = Receiver.ROOM;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toPassenger(passengerid: string): MessageLauncher {
    this.message.to.id = passengerid;
    this.message.to.type = Receiver.PASSENGER;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toStranger(strangerid: string): MessageLauncher {
    this.message.to.id = strangerid;
    this.message.to.type = Receiver.STRANGER;
    return new MessageLauncherImpl(this.session, this.message);
  }

}

class MessageLauncherImpl implements MessageLauncher {

  public session: SessionImpl;
  public message: MessageTo;

  constructor(session: SessionImpl, message: MessageTo) {
    this.session = session;
    this.message = message;
  }

  public ok(callback?: Callback<void>): Session {
    try {
      this.session.socket.emit("say", this.message);
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

  private friends: Array<Handler2<string, BasicMessageFrom>>;
  private groups: Array<Handler3<string, string, BasicMessageFrom>>;
  private rooms: Array<Handler3<string, string, BasicMessageFrom>>;
  private passengers: Array<Handler2<string, BasicMessageFrom>>;
  private strangers: Array<Handler2<string, BasicMessageFrom>>;
  private friendonlines: Array<Handler1<string>>;
  private friendofflines: Array<Handler1<string>>;
  private strangeronlineds: Array<Handler1<string>>;
  private strangerofflines: Array<Handler1<string>>;
  private systems: Array<Handler1<SystemMessageFrom>>;
  private yourselfs: Array<Handler1<YourselfMessageFrom>>;

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

  public setNotifyAll(enable: boolean): SessionBuilder {
    this.authdata.notifyAll = enable;
    return this;
  }

  public setInstallation(installation: string): SessionBuilder {
    this.authdata.install = installation;
    return this;
  }

  public onFriendMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder {
    this.friends.push(handler);
    return this;
  }

  public onGroupMessage(handler: Handler3<string, string, MessageFrom>): SessionBuilder {
    this.groups.push(handler);
    return this;
  }

  public onRoomMessage(handler: Handler3<string, string, MessageFrom>): SessionBuilder {
    this.rooms.push(handler);
    return this;
  }

  public onPassengerMessage(handler: Handler2<string, MessageFrom>): SessionBuilder {
    this.passengers.push(handler);
    return this;
  }

  public onStrangerMessage(handler: Handler2<string, MessageFrom>): SessionBuilder {
    this.strangers.push(handler);
    return this;
  }

  public onFriendOnline(handler: Handler1<string>): SessionBuilder {
    this.friendonlines.push(handler);
    return this;
  }

  public onFriendOffline(handler: Handler1<string>): SessionBuilder {
    this.friendofflines.push(handler);
    return this;
  }

  public onStrangerOnline(handler: Handler1<string>): SessionBuilder {
    this.strangeronlineds.push(handler);
    return this;
  }

  public onStrangerOffline(handler: Handler1<string>): SessionBuilder {
    this.strangerofflines.push(handler);
    return this;
  }

  public onSystemMessage(handler: Handler1<SystemMessageFrom>): SessionBuilder {
    this.systems.push(handler);
    return this;
  }

  public onYourself(handler: Handler1<YourselfMessageFrom>): SessionBuilder {
    this.yourselfs.push(handler);
    return this;
  }

  public ok(callback: Callback2<Session, Context>) {
    const url = `${this.apiOptions.server}/chat`;
    const socket = io.connect(url, {
      query: `auth=${JSON.stringify(this.authdata)}`,
      transports: ["websocket"],
    });
    socket.once("login", (result) => {
      const foo = result as LoginResult;
      if (foo.success) {
        const session = new SessionImpl(socket, foo.id);
        const ctx = new ContextImpl(this.apiOptions, result.id);
        callback(null, session, ctx);
      } else {
        callback(new Error(`error: ${foo.error}`), null, null);
      }
    });

    socket.on("message", (income) => {
      const msg = income as MessageFrom;
      const basicmsg = convert2basic(msg);
      switch (msg.from.type) {
        case Receiver.ACTOR:
          for (const handler of this.friends) {
            handler(msg.from.id, basicmsg);
          }
          break;
        case Receiver.GROUP:
          for (const handler of this.groups) {
            handler(msg.from.gid, msg.from.id, basicmsg);
          }
          break;
        case Receiver.ROOM:
          for (const handler of this.rooms) {
            handler(msg.from.gid, msg.from.id, basicmsg);
          }
          break;
        case Receiver.PASSENGER:
          for (const handler of this.passengers) {
            handler(msg.from.id, basicmsg);
          }
          break;
        case Receiver.STRANGER:
          for (const handler of this.strangers) {
            handler(msg.from.id, basicmsg);
          }
          break;
        default:
          break;
      }
    });

    socket.on("online", (onlineid) => {
      for (const handler of this.friendonlines) {
        handler(onlineid as string);
      }
    });

    socket.on("offline", (offlineid) => {
      for (const handler of this.friendofflines) {
        handler(offlineid as string);
      }
    });

    socket.on("online_x", (onlineid) => {
      for (const handler of this.strangeronlineds) {
        handler(onlineid as string);
      }
    });

    socket.on("offline_x", (offlineid) => {
      for (const handler of this.strangerofflines) {
        handler(offlineid as string);
      }
    });

    socket.on("sys", (income) => {
      const msg = income as BasicMessageFrom;
      for (const handler of this.systems) {
        handler(msg);
      }
    });

    socket.on("yourself", (income) => {
      const msg = income as YourselfMessageFrom;
      for (const handler of this.yourselfs) {
        handler(msg);
      }
    });
  }
}

class SessionImpl implements Session {
  private closed: boolean;
  private userid: string;

  public socket: Socket;

  constructor(socket: Socket, userid: string) {
    this.closed = false;
    this.socket = socket;
    this.userid = userid;
  }

  public current(): string {
    return this.userid;
  }

  public say(text: string, remark?: string): MessageBuilder {
    if (this.closed) {
      throw new Error("session is closed.");
    }
    return new MessageBuilderImpl(this, text, remark);
  }

  public close(callback?: Callback<void>): void {
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

  onFriendMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onGroupMessage(handler: Handler3<string, string, BasicMessageFrom>): SessionBuilder;

  onRoomMessage(handler: Handler3<string, string, BasicMessageFrom>): SessionBuilder;

  onPassengerMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onStrangerMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onFriendOnline(handler: Handler1<string>): SessionBuilder;

  onFriendOffline(handler: Handler1<string>): SessionBuilder;

  onStrangerOnline(handler: Handler1<string>): SessionBuilder;

  onStrangerOffline(handler: Handler1<string>): SessionBuilder;

  onSystemMessage(handler: Handler1<SystemMessageFrom>): SessionBuilder;

  onYourself(handler: Handler1<YourselfMessageFrom>): SessionBuilder;

  ok(callback: Callback2<Session, Context>);
}
