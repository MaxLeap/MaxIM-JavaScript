import {PassengerMessageLauncher, PassengerSession} from "../../api/passenger";
import {MessageTo} from "../../model/messages";
import {Callback} from "../../model/models";
import {PassengerSessionImpl} from "./session";

class PassengerMessageLauncherImpl implements PassengerMessageLauncher {

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

export {
  PassengerMessageLauncherImpl,
};
