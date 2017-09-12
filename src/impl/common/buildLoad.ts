import Axios from "axios";
import {LoadBuilder} from "../../api/common";
import {Callback, GroupInfo, Passenger, RoomInfo, UserDetail} from "../../model/models";
import {Builder} from "./builder";

interface LoadOptions {
  id: string;
}

class LoadBuilderImpl extends Builder<LoadOptions> implements LoadBuilder {

  public forUser(callback: Callback<UserDetail>) {
    this.forSomething("/ctx", callback);
  }

  public forGroup(callback: Callback<GroupInfo>) {
    this.forSomething("/groups", callback);
  }

  public forRoom(callback: Callback<RoomInfo>) {
    this.forSomething("/rooms", callback);
  }

  public forPassenger(callback: Callback<Passenger>) {
    this.forSomething("/passengers", callback);
  }

  private forSomething<T>(path: string, callback: Callback<T>) {
    const url = `${this.apiOptions.server}${path}/${this.extOptions.id}`;
    Axios.post(url, null, {headers: this.apiOptions.headers})
        .then((response) => {
          return response.data as T;
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
  }
}

export {
  LoadBuilderImpl,
};
