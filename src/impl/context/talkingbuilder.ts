import {Context, TalkingBuilder} from "../../api/context";
import {APIOptions, Callback, ChatRecord} from "../../model/models";

class TalkingBuilderImpl implements TalkingBuilder {

  private ts: number;
  private size: number;
  private context: Context;
  private you: string;
  private apiOptions: APIOptions;

  constructor(context: Context, ts: number, size: number, you: string, apiOptions: APIOptions) {
    this.ts = ts;
    this.size = size;
    this.context = context;
    this.you = you;
    this.apiOptions = apiOptions;
  }

  public ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): Context {
    if (!callback) {
      return this.context;
    }
    return this.listHistories(`/ctx/${this.you}/friends/${friendid}/chats`, callback);
  }

  public ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): Context {
    if (!callback) {
      return this.context;
    }
    return this.listHistories(`/groups/${groupid}/chats`, callback);
  }

  public ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): Context {
    if (!callback) {
      return this.context;
    }
    return this.listHistories(`/ctx/${this.you}/strangers/${strangerid}/chats`, callback);
  }

  public ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): Context {
    if (!callback) {
      return this.context;
    }
    return this.listHistories(`/passengers/${passengerid}/chats/${this.you}`, callback);
  }

  private listHistories(path: string, callback: Callback<ChatRecord[]>): Context {
    let url = `${this.apiOptions.server}${path}`;
    const q: string[] = [];
    if (this.ts > 0) {
      q.push(`ts=${this.ts}`);
    }
    if (this.size > 0) {
      q.push(`limit=${this.size}`);
    }

    if (q.length > 0) {
      url += "?" + q.join("&");
    }
    axios.get(url, {headers: this.apiOptions.headers})
        .then((response) => {
          return response.data as ChatRecord[];
        })
        .then((records) => {
          if (callback) {
            callback(null, records);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
    return this.context;
  }
}

export {
  TalkingBuilderImpl,
};
