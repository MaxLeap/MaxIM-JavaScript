import {Admin, MemberAppendCommand} from "../../api/admin";
import {Callback} from "../../model/models";

class MemberAppendCommandImpl implements MemberAppendCommand {

  private admin: Admin;
  private members: { members: string[] };

  constructor(admin: Admin, members: string[]) {
    this.admin = admin;
    this.members = {
      members,
    };
  }

  public intoRoom(roomid: string, callback?: Callback<void>): Admin {
    return this.invokeAppend(`/rooms/${roomid}`, callback);
  }

  public intoGroup(groupid: string, callback?: Callback<void>): Admin {
    return this.invokeAppend(`/groups/${groupid}`, callback);
  }

  private invokeAppend(path: string, callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}${path}/members`;
    axios.post(url, JSON.stringify(this.members), {headers: this.admin.options().headers})
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
  MemberAppendCommandImpl,
};
