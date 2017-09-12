import {Admin, MemberRemoveCommand} from "../../api/admin";
import {Callback} from "../../model/models";
import Axios from "axios";

class MemberRemoveCommandImpl implements MemberRemoveCommand {

  private admin: Admin;
  private members: { members: string[] };

  constructor(admin: Admin, members: string[]) {
    this.admin = admin;
    this.members = {
      members,
    };
  }

  public fromRoom(roomid: string, callback?: Callback<void>): Admin {
    return this.invokeDelete(`/rooms/${roomid}`, callback);
  }

  public fromGroup(groupid: string, callback?: Callback<void>): Admin {
    return this.invokeDelete(`/groups/${groupid}`, callback);
  }

  private invokeDelete(path: string, callback?: Callback<void>): Admin {
    const op = this.admin.options();
    const url = `${op.server}${path}/members`;
    const req = {
      url,
      method: "DELETE",
      data: JSON.stringify(this.members),
      headers: op.headers,
    };
    Axios.request(req)
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
  MemberRemoveCommandImpl,
};
