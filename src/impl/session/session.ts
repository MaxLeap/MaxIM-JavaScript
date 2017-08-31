import Socket = SocketIOClient.Socket;
import {MessageBuilder, Session} from "../../api/session";
import {Callback} from "../../model/models";
import {MessageBuilderImpl} from "./buildMessage";

class SessionImpl implements Session {

  public socket: Socket;

  private closed: boolean;
  private userid: string;

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
    if (!this.closed) {
      this.closed = true;
      this.socket.close();
    }
    if (callback) {
      callback();
    }
  }
}

export {
  SessionImpl,
};
