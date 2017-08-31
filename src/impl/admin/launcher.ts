import {Admin, AdminMessageLauncher} from "../../api/admin";
import {Receiver, SystemMessageTo} from "../../model/messages";
import {Callback} from "../../model/models";

class AdminMessageLauncherImpl implements AdminMessageLauncher {

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
    axios.post(url, JSON.stringify(this.message), {headers: this.admin.options().headers})
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
