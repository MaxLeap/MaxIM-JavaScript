import * as io from "socket.io-client";
import {PassengerBuilder, PassengerContext, PassengerSession,} from "../../api/passenger";
import {md5} from "../../helper/md5";
import {convert2basic, ParrotError} from "../../helper/utils";
import {BasicMessageFrom, MessageFrom, Receiver} from "../../model/messages";
import {APIOptions, Attributes, Callback2, Handler1, Handler2, LoginResult} from "../../model/models";
import {PassengerContextImpl} from "./context";
import {PassengerSessionImpl} from "./session";

class PassengerBuilderImpl implements PassengerBuilder {

  private id: string;
  private options: APIOptions;
  private attributes: Attributes = [];
  private fromUser: Array<Handler2<string, BasicMessageFrom>> = [];
  private fromSystem: Array<Handler1<BasicMessageFrom>> = [];
  private fromStrangerOnline: Array<Handler1<string>> = [];
  private fromStrangerOffline: Array<Handler1<string>> = [];
  private acks: Array<Handler2<number, number>> = [];

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

  public onAck(callback: Handler2<number, number>): PassengerBuilder {
    this.acks.push(callback);
    return this;
  }

  public ok(callback: Callback2<PassengerSession, PassengerContext>) {
    const url = `${this.options.server}/chat`;

    const foo = new Date().getTime();
    const bar = md5(`${foo}${this.options.sign}`) + "," + foo;
    const qux: any = {};
    const authdata = {
      app: this.options.app,
      sign: bar,
      passenger: qux,
    };

    for (const k in this.attributes) {
      if (k === "id") {
        continue;
      }
      qux[k] = this.attributes[k];
    }

    if (this.id) {
      qux.id = this.id;
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

    socket.on("ack", (income) => {
      const msg = income as { ack: number, ts: number };
      for (const it of this.acks) {
        it(msg.ack, msg.ts);
      }
    });

  }
}

export {
  PassengerBuilderImpl,
};
