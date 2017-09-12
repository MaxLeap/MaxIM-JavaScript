import {Admin, GroupBuilder} from "../../api/admin";
import {Attributes, Callback} from "../../model/models";
import Axios from "axios";

class GroupBuilderImpl implements GroupBuilder {

  private admin: Admin;
  private owner: string;
  private appends: string[];
  private attributes: Attributes;

  constructor(admin: Admin, owner: string) {
    this.admin = admin;
    this.appends = [];
    this.owner = owner;
  }

  public attribute(key: string, value: any): GroupBuilder {
    if (!this.attributes) {
      this.attributes = {};
    }
    this.attributes[key] = value;
    return this;
  }

  public members(first: string, others: string): GroupBuilder {
    this.appends.push(first);
    if (others && others.length > 0) {
      for (const s of others) {
        this.appends.push(s);
      }
    }
    return this;
  }

  public ok(callback?: Callback<string>): Admin {
    const url = `${this.admin.options().server}/groups`;
    const data = {
      owner: this.owner,
      members: this.appends,
    };

    Axios.post(url, JSON.stringify(data), {headers: this.admin.options().headers})
        .then((response) => {
          return response.data as string;
        })
        .then((groupid) => {
          this.admin
              .setAttributes(this.attributes)
              .forGroup(groupid, (err) => {
                if (callback) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, groupid);
                  }
                }
              });
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
  GroupBuilderImpl,
};
