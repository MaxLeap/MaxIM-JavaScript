import {Admin, AttributeBuilder} from "../../api/admin";
import {Attributes, Callback} from "../../model/models";
import Axios from "axios";

class AttributeBuilderImpl implements AttributeBuilder {

  private admin: Admin;
  private attributes: Attributes;
  private overwrite: boolean;

  constructor(admin: Admin, attributes: Attributes, overwrite?: boolean) {
    this.admin = admin;
    this.attributes = attributes;
    this.overwrite = overwrite || false;
  }

  public forUser(userid: string, callback: Callback<void>): Admin {
    return this.process(`/ctx/${userid}/attributes`, callback);
  }

  public forGroup(groupid: string, callback: Callback<void>): Admin {
    return this.process(`/groups/${groupid}/attributes`, callback);
  }

  public forRoom(roomid: string, callback: Callback<void>): Admin {
    return this.process(`/rooms/${roomid}/attributes`, callback);
  }

  private process(path: string, callback: Callback<void>): Admin {
    const url = `${this.admin.options().server}${path}`;
    const postData = JSON.stringify(this.attributes);
    const cfg = {headers: this.admin.options().headers};
    (this.overwrite ? Axios.put(url, postData, cfg) : Axios.post(url, postData, cfg))
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
  AttributeBuilderImpl,
};
