import {Admin, RoomDestroy} from "../../api/admin";
import {Callback} from "../../model/models";
import Axios from "axios";

class RoomDestroyImpl implements RoomDestroy {

  private admin: Admin;
  private roomid: string;

  constructor(admin: Admin, roomid: string) {
    this.admin = admin;
    this.roomid = roomid;
  }

  public ok(callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}/rooms/${this.roomid}`;
    Axios.delete(url, {headers: this.admin.options().headers})
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
  RoomDestroyImpl,
};
