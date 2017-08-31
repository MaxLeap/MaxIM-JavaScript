import * as io from "socket.io-client";
import {Context} from "../../api/context";
import {Session, SessionBuilder} from "../../api/session";
import {convert2basic} from "../../helper/utils";
import {BasicMessageFrom, MessageFrom, Receiver, SystemMessageFrom, YourselfMessageFrom} from "../../model/messages";
import {APIOptions, Callback2, Handler1, Handler2, Handler3, LoginResult} from "../../model/models";
import {ContextImpl} from "../context/context";
import {SessionImpl} from "./session";

class SessionBuilderImpl implements SessionBuilder {

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
  private acks: Array<Handler2<number, number>>;

  private apiOptions: APIOptions;
  private authdata: any;

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
    this.acks = [];
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

  public onAck(handler: Handler2<number, number>): SessionBuilder {
    this.acks.push(handler);
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
          for (const it of this.friends) {
            it(msg.from.id, basicmsg);
          }
          break;
        case Receiver.GROUP:
          for (const it of this.groups) {
            it(msg.from.gid, msg.from.id, basicmsg);
          }
          break;
        case Receiver.ROOM:
          for (const it of this.rooms) {
            it(msg.from.gid, msg.from.id, basicmsg);
          }
          break;
        case Receiver.PASSENGER:
          for (const it of this.passengers) {
            it(msg.from.id, basicmsg);
          }
          break;
        case Receiver.STRANGER:
          for (const it of this.strangers) {
            it(msg.from.id, basicmsg);
          }
          break;
        default:
          break;
      }
    });

    socket.on("online", (onlineid) => {
      for (const it of this.friendonlines) {
        it(onlineid as string);
      }
    });

    socket.on("offline", (offlineid) => {
      for (const it of this.friendofflines) {
        it(offlineid as string);
      }
    });

    socket.on("online_x", (onlineid) => {
      for (const it of this.strangeronlineds) {
        it(onlineid as string);
      }
    });

    socket.on("offline_x", (offlineid) => {
      for (const it of this.strangerofflines) {
        it(offlineid as string);
      }
    });

    socket.on("sys", (income) => {
      const msg = income as BasicMessageFrom;
      for (const it of this.systems) {
        it(msg);
      }
    });

    socket.on("yourself", (income) => {
      const msg = income as YourselfMessageFrom;
      for (const it of this.yourselfs) {
        it(msg);
      }
    });

    socket.on("ack", (income) => {
      const msg = income as { ack: number, ts: number };
      for (const it of this.acks) {
        it(msg.ack, msg.ts);
      }
    });
  }
}

export {
  SessionBuilderImpl,
};
