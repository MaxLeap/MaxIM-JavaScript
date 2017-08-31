import * as axios from "axios";
import {SearchBuilder} from "../../api/common";
import {Callback, GroupInfo, RoomInfo, UserOutline} from "../../model/models";
import {Builder} from "./builder";

interface SearchOptions {
  query?: { [key: string]: any };
  skip?: number;
  limit?: number;
  sort?: string[];
}

class SearchBuilderImpl extends Builder<SearchOptions> implements SearchBuilder {

  public forUsers(callback?: Callback<UserOutline[]>) {
    this.forSomething("/ctx", callback);
  }

  public forGroups(callback?: Callback<GroupInfo[]>) {
    this.forSomething("/groups", callback);
  }

  public forRooms(callback?: Callback<RoomInfo[]>) {
    this.forSomething("/rooms", callback);
  }

  private getUrl(path: string): string {
    const q: string[] = [];
    for (const k in this.extOptions.query) {
      const v = this.extOptions.query[k];
      q.push(`${k}=${v}`);
    }
    q.push(`_skip=${this.extOptions.skip || 0}`);
    q.push(`_limit=${this.extOptions.limit || 20}`);
    return `${this.apiOptions.server}${path}?${q.join("&")}`;
  }

  private forSomething<T>(path: string, callback: Callback<T>) {
    const url = this.getUrl(path);

    axios.get(url, {headers: this.apiOptions.headers})
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
  SearchBuilderImpl,
};
