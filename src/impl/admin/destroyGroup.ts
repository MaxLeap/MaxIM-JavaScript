import {Admin, GroupDestroy} from "../../api/admin";
import {Callback} from "../../model/models";

class GroupDestroyImpl implements GroupDestroy {

  private admin: Admin;
  private groupid: string;

  constructor(admin: Admin, groupid: string) {
    this.admin = admin;
    this.groupid = groupid;
  }

  public ok(callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}/groups/${this.groupid}`;
    axios.delete(url, {headers: this.admin.options().headers})
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
  GroupDestroyImpl,
};
