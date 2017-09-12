import Axios from "axios";
import {CommonService, GetAttributesBuilder} from "../../api/common";
import {Callback} from "../../model/models";

class GetAttributesBuilderImpl implements GetAttributesBuilder {

  private id: string;
  private attr: string;
  private common: CommonService;

  constructor(common: CommonService, id: string, attr?: string) {
    this.common = common;
    this.id = id;
    this.attr = attr;
  }

  public forUser(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/ctx/${this.id}`, callback);
  }

  public forGroup(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/groups/${this.id}`, callback);
  }

  public forRoom(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/rooms/${this.id}`, callback);
  }

  private forAttr(path: string, callback: Callback<any>) {
    let url = `${this.common.options().server}${path}/attributes`;
    if (this.attr) {
      url += `/${this.attr}`;
    }

    Axios.get(url, {headers: this.common.options().headers})
        .then((response) => {
          return response.data as string;
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
  GetAttributesBuilderImpl,
};
