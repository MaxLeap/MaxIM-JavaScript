import {Admin, RoomBuilder} from "../../api/admin";
import {Callback} from "../../model/models";

class RoomBuilderImpl implements RoomBuilder {

  private admin: Admin;
  private attributes: { [key: string]: any };
  private appends: string[];

  constructor(admin: Admin) {
    this.admin = admin;
    this.attributes = {};
    this.appends = [];
  }

  public members(first: string, ...others: string[]): RoomBuilder {
    this.appends.push(first);
    if (others) {
      for (const s of others) {
        this.appends.push(s);
      }
    }
    return this;
  }

  public attribute(key: string, value: any): RoomBuilder {
    this.attributes[key] = value;
    return this;
  }

  public ok(callback?: Callback<string>): Admin {
    const op = this.admin.options();
    const url = `${op.server}/rooms`;
    const body = {
      members: this.appends,
    };

    const config = {headers: op.headers};
    axios.post(url, JSON.stringify(body), config)
        .then((response) => {
          return response.data as string;
        })
        .then((roomid) => {
          const url2 = `${op.server}/rooms/${roomid}/attributes`;
          const postData = JSON.stringify(this.attributes);
          return axios.post(url2, postData, {headers: op.headers})
              .then((ignore) => {
                return roomid;
              });
        })
        .then((roomid) => {
          if (callback) {
            callback(null, roomid);
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
  RoomBuilderImpl,
};
