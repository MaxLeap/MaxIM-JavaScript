import {Context, TalkingBuilder} from "../../api/context";
import {APIOptions, Attributes, Callback, Friend, MyGroup, RoomInfo, UserOutline} from "../../model/models";
import {CommonServiceImpl} from "../common/common";
import {TalkingBuilderImpl} from "./talkingbuilder";
import Axios from "axios";

class ContextImpl extends CommonServiceImpl implements Context {

  private you: string;

  constructor(apiOptions: APIOptions, you: string) {
    super(apiOptions);
    this.you = you;
  }

  public listFriends(callback?: Callback<Friend[]>): Context {
    if (!callback) {
      return this;
    }
    return this.listSomething(`/ctx/${this.you}/friends?detail`, callback);
  }

  public listGroups(callback?: Callback<MyGroup[]>): Context {
    if (!callback) {
      return this;
    }
    return this.listSomething(`/ctx/${this.you}/groups?detail`, callback);
  }

  public listRooms(callback?: Callback<RoomInfo[]>): Context {
    if (!callback) {
      return this;
    }
    return this.listSomething(`/ctx/${this.you}/rooms?detail`, callback);
  }

  public listStrangers(callback: Callback<UserOutline[]>, skip?: number, limit?: number): Context {
    if (!callback) {
      return this;
    }
    let path = `/ctx/${this.you}/strangers?detail`;
    if (skip) {
      path += `&skip=${skip}`;
    }
    if (limit) {
      path += `&limit=${limit}`;
    }
    return this.listSomething(path, callback);
  }

  public joinFriend(userid: string, callback?: Callback<void>): Context {
    const url = `${super.options().server}/ctx/${this.you}/friends/${userid}`;
    Axios.post(url, null, {headers: super.options().headers})
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
    return this;
  }

  public joinGroup(groupid: string, callback?: Callback<void>): Context {
    const url = `${super.options().server}/groups/${groupid}/members/${this.you}`;
    Axios.post(url, null, {headers: super.options().headers})
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
    return this;
  }

  public joinRoom(roomid: string, callback?: Callback<void>): Context {
    const url = `${super.options().server}/rooms/${roomid}/members/${this.you}`;
    Axios.post(url, null, {headers: super.options().headers})
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
    return this;
  }

  public listTalkings(endTimestamp?: number, size?: number): TalkingBuilder {
    return new TalkingBuilderImpl(this, endTimestamp || 0, size || 0, this.you, super.options());
  }

  public leaveFriend(userid: string, callback?: Callback<void>): Context {
    const path = `/ctx/${this.you}/friends/${userid}`;
    return this.deleteSomething(path, callback);
  }

  public leaveGroup(groupid: string, callback?: Callback<void>): Context {
    const path = `/groups/${groupid}/members/${this.you}`;
    return this.deleteSomething(path, callback);
  }

  public leaveRoom(roomid: string, callback?: Callback<void>): Context {
    const path = `/rooms/${roomid}/members/${this.you}`;
    return this.deleteSomething(path, callback);
  }

  public setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): Context {
    const url = `/ctx/${this.you}/attributes`;
    const postData = JSON.stringify(attributes);
    const cfg = {headers: this.options().headers};
    (overwrite ? Axios.put(url, postData, cfg) : Axios.post(url, postData, cfg))
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
    return this;
  }

  public setMyAttribute(name: string, value: any, callback?: Callback<void>): Context {
    const attributes = {};
    attributes[name] = value;
    return this.setMyAttributes(attributes, false, callback);
  }

  public getMyAttributes(callback?: Callback<Attributes>): Context {
    if (callback) {
      super.getAttributes(this.you).forUser(callback);
    }
    return this;
  }

  public getMyAttribute(attributeName: string, callback?: Callback<any>): Context {
    if (callback) {
      super.getAttributes(this.you, attributeName).forUser(callback);
    }
    return this;
  }

  private listSomething<T>(path: string, callback: Callback<T>) {
    const url = `${super.options().server}${path}`;
    Axios.get(url, {headers: super.options().headers})
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
    return this;
  }

  private deleteSomething(path: string, callback: Callback<void>): Context {
    const url = `${super.options().server}${path}`;
    Axios.delete(url, {headers: super.options().headers})
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

    return this;
  }
}

export {
  ContextImpl,
};
