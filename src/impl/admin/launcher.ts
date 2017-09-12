import {Admin, MessageLauncher} from "../../api/admin";
import {Receiver, SystemMessageTo} from "../../model/messages";
import {Callback} from "../../model/models";
import Axios from "axios";

class AdminMessageLauncherImpl implements MessageLauncher {

  private admin: Admin;
  private message: SystemMessageTo;
  private receiver: {
    type?: Receiver;
    id?: string;
  };

  constructor(admin: Admin, message: SystemMessageTo, receiver: { type?: Receiver; id?: string }) {
    this.admin = admin;
    this.message = message;
    this.receiver = receiver;
  }

  public ok(callback?: Callback<void>): Admin {
    let url = `${this.admin.options().server}/system`;
    if (this.receiver.id) {
      url += `/${this.receiver.id}`;
      switch (this.receiver.type) {
        case Receiver.GROUP:
          url += "?group";
          break;
        case Receiver.ROOM:
          url += "?room";
          break;
        default:
          break;
      }
    }
    Axios.post(url, JSON.stringify(this.message), {headers: this.admin.options().headers})
        .then((ignore) => {
          if (callback) {
            callback(null, null);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
    return this.admin;
  }
}

export {
  AdminMessageLauncherImpl,
};
