import {MessageLauncher, Session} from "../../api/session";
import {MessageTo} from "../../model/messages";
import {Callback} from "../../model/models";
import {SessionImpl} from "./session";

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

export {
  MessageLauncherImpl,
};
