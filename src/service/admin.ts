import axios = require("axios");
import {Media, PushSettings, Receiver, SystemMessageTo} from "../model/messages";
import {Attributes, Callback} from "../model/models";
import {CommonService, CommonServiceImpl} from "./common";

export interface Admin extends CommonService {
  /**
   * 发送系统消息
   * @param text
   * @param remark
   */
  say(text: string, remark?: string): MessageBuilder;

  /**
   * 属性设置
   * @param attributes
   * @param overwrite
   */
  setAttributes(attributes: Attributes, overwrite?: boolean): AttributeBuilder;

  /**
   * 创建
   */
  create(): CreateCommand;

  /**
   * 销毁
   */
  destroy(): DestroyCommand;

  /**
   * 移除成员
   * @param first
   * @param others
   */
  removeMembers(first: string, ...others: string[]): MemberRemoveCommand;

  /**
   * 追加成员
   * @param first
   * @param others
   */
  appendMembers(first: string, ...others: string[]): MemberAppendCommand;

}

interface CreateCommand {
  group(owner: string): GroupBuilder;

  room(): RoomBuilder;
}

interface DestroyCommand {
  group(groupid: string): GroupDestroy;

  room(roomid: string): RoomDestroy;
}

interface GroupDestroy {
  ok(callback?: Callback<void>): Admin;
}

class GroupDestroyImpl implements GroupDestroy {

  private admin: AdminImpl;
  private groupid: string;

  constructor(admin: AdminImpl, groupid: string) {
    this.admin = admin;
    this.groupid = groupid;
  }

  public ok(callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}/groups/${this.groupid}`;

    axios.delete(url, {headers: this.admin.options().headers})
        .then((response) => {
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

interface RoomDestroy {
  ok(callback?: Callback<void>): Admin;
}

class RoomDestroyImpl implements RoomDestroy {

  private admin: AdminImpl;
  private roomid: string;

  constructor(admin: AdminImpl, roomid: string) {
    this.admin = admin;
    this.roomid = roomid;
  }

  public ok(callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}/rooms/${this.roomid}`;

    axios.delete(url, {headers: this.admin.options().headers})
        .then((response) => {
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

class DestroyCommandImpl implements DestroyCommand {

  private admin: AdminImpl;

  constructor(admin: AdminImpl) {
    this.admin = admin;
  }

  public group(groupid: string): GroupDestroy {
    return new GroupDestroyImpl(this.admin, groupid);
  }

  public room(roomid: string): RoomDestroy {
    return new RoomDestroyImpl(this.admin, roomid);
  }
}

class CreateCommandImpl implements CreateCommand {

  private admin: AdminImpl;

  constructor(admin: AdminImpl) {
    this.admin = admin;
  }

  public group(owner: string): GroupBuilder {
    return new GroupBuilderImpl(this.admin, owner);
  }

  public room(): RoomBuilder {
    return new RoomBuilderImpl(this.admin);
  }
}

interface GroupBuilder {
  attribute(key: string, value: any): GroupBuilder;

  members(first: string, ...others: string[]): GroupBuilder;

  ok(callback?: Callback<string>): Admin;
}

class GroupBuilderImpl implements GroupBuilder {

  private admin: AdminImpl;
  private owner: string;
  private appends: string[];
  private attributes: Attributes;

  constructor(admin: AdminImpl, owner: string) {
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

    axios.post(url, JSON.stringify(data), {headers: this.admin.options().headers})
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

interface MemberAppendCommand {
  intoRoom(roomid: string, callback?: Callback<void>): Admin;

  intoGroup(groupid: string, callback?: Callback<void>): Admin;
}

interface MemberRemoveCommand {
  fromRoom(roomid: string, callback?: Callback<void>): Admin;

  fromGroup(groupid: string, callback?: Callback<void>): Admin;
}

class MemberAppendCommandImpl implements MemberAppendCommand {

  private admin: AdminImpl;
  private members: {
    members: string[],
  };

  constructor(admin: AdminImpl, members: string[]) {
    this.admin = admin;
    this.members = {
      members,
    };
  }

  private _append(path: string, callback?: Callback<void>): Admin {
    const url = `${this.admin.options().server}${path}/members`;
    axios.post(url, JSON.stringify(this.members), {headers: this.admin.options().headers})
        .then((response) => {
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

  public intoRoom(roomid: string, callback?: Callback<void>): Admin {
    return this._append(`/rooms/${roomid}`, callback);
  }

  public intoGroup(groupid: string, callback?: Callback<void>): Admin {
    return this._append(`/groups/${groupid}`, callback);
  }

}

class MemberRemoveCommandImpl implements MemberRemoveCommand {

  private admin: AdminImpl;
  private members: {
    members: string[];
  };

  constructor(admin: AdminImpl, members: string[]) {
    this.admin = admin;
    this.members = {
      members,
    };
  }

  private _delete(path: string, callback?: Callback<void>): Admin {
    const op = this.admin.options();
    const url = `${op.server}${path}/members`;
    const req = {
      url,
      method: "DELETE",
      data: JSON.stringify(this.members),
      headers: op.headers,
    };
    axios.request(req)
        .then((response) => {
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

  public fromRoom(roomid: string, callback?: Callback<void>): Admin {
    return this._delete(`/rooms/${roomid}`, callback);
  }

  public fromGroup(groupid: string, callback?: Callback<void>): Admin {
    return this._delete(`/groups/${groupid}`, callback);
  }

}

interface MessageBuilder {
  asText(): MessageBuilder;

  asImage(): MessageBuilder;

  asAudio(): MessageBuilder;

  asVideo(): MessageBuilder;

  disablePush(): MessageBuilder;

  setPushSound(sound: string): MessageBuilder;

  setPushBadge(badge: number): MessageBuilder;

  setPushContentAvailable(contentAvailable: boolean): MessageBuilder;

  setPushPrefix(prefix: string): MessageBuilder;

  setPushSuffix(suffix: string): MessageBuilder;

  setPushTextOverwrite(text: string): MessageBuilder;

  toAll(): MessageLauncher;

  toUser(userid: string): MessageLauncher;

  toGroup(groupid: string): MessageLauncher;

  toRoom(roomid: string): MessageLauncher;
}

interface MessageLauncher {
  ok(callback?: Callback<void>): Admin;
}

class MessageBuilderImpl implements MessageBuilder {

  private admin: AdminImpl;
  private receiver: {
    id?: string;
    type?: Receiver
  };
  private message: SystemMessageTo;

  constructor(admin: AdminImpl, text: string, remark?: string) {
    this.admin = admin;
    this.message = {
      content: {
        media: Media.TEXT,
        body: text,
      },
    };
    if (remark !== undefined && remark !== null) {
      this.message.remark = remark;
    }
  }

  private touchPush(): PushSettings {
    if (!this.message.push) {
      this.message.push = {};
    }
    return this.message.push;
  }

  public disablePush(): MessageBuilder {
    this.touchPush().enable = false;
    return this;
  }

  public setPushSound(sound: string): MessageBuilder {
    this.touchPush().sound = sound;
    return this;
  }

  public setPushBadge(badge: number): MessageBuilder {
    this.touchPush().badge = badge;
    return this;
  }

  public setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
    this.touchPush().contentAvailable = contentAvailable;
    return this;
  }

  public setPushPrefix(prefix: string): MessageBuilder {
    this.touchPush().prefix = prefix;
    return this;
  }

  public setPushSuffix(suffix: string): MessageBuilder {
    this.touchPush().suffix = suffix;
    return this;
  }

  public setPushTextOverwrite(text: string): MessageBuilder {
    this.touchPush().overwrite = text;
    return this;
  }

  public asText(): MessageBuilder {
    this.message.content.media = Media.TEXT;
    return this;
  }

  public asImage(): MessageBuilder {
    this.message.content.media = Media.IMAGE;
    return this;
  }

  public asAudio(): MessageBuilder {
    this.message.content.media = Media.AUDIO;
    return undefined;
  }

  public asVideo(): MessageBuilder {
    this.message.content.media = Media.VIDEO;
    return undefined;
  }

  public toAll(): MessageLauncher {
    this.receiver = {};
    return new MessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toUser(userid: string): MessageLauncher {
    this.receiver = {
      id: userid,
      type: Receiver.ACTOR,
    };
    return new MessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toGroup(groupid: string): MessageLauncher {
    this.receiver = {
      id: groupid,
      type: Receiver.GROUP,
    };
    return new MessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toRoom(roomid: string): MessageLauncher {
    this.receiver = {
      id: roomid,
      type: Receiver.ROOM,
    };
    return new MessageLauncherImpl(this.admin, this.message, this.receiver);
  }
}

class MessageLauncherImpl implements MessageLauncher {

  private admin: AdminImpl;
  private message: SystemMessageTo;
  private receiver: {
    type?: Receiver;
    id?: string;
  };

  constructor(admin: AdminImpl, message: SystemMessageTo, receiver: { type?: Receiver; id?: string }) {
    this.admin = admin;
    this.message = message;
    this.receiver = receiver;
  }

  public ok(callback?: Callback<void>): Admin {
    let url = `${this.admin.options().server}/system`;

    if (this.receiver.id) {
      url += `/${this.receiver.id}`;
      switch (this.receiver.type) {
        case Receiver.GROUP:
          url += "?group";
          break;
        case Receiver.ROOM:
          url += "?room";
          break;
        default:
          break;
      }
    }

    axios.post(url, JSON.stringify(this.message), {headers: this.admin.options().headers})
        .then((response) => {
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

interface AttributeBuilder {
  forUser(userid: string, callback?: Callback<void>): Admin;

  forGroup(groupid: string, callback?: Callback<void>): Admin;

  forRoom(roomid: string, callback?: Callback<void>): Admin;
}

class AttributeBuilderImpl implements AttributeBuilder {

  private admin: AdminImpl;
  private attributes: Attributes;
  private overwrite: boolean;

  constructor(admin: AdminImpl, attributes: Attributes, overwrite?: boolean) {
    this.admin = admin;
    this.attributes = attributes;
    this.overwrite = overwrite || false;
  }

  private process(path: string, callback: Callback<void>): Admin {
    const url = `${this.admin.options().server}${path}`;
    const postData = JSON.stringify(this.attributes);
    const cfg = {headers: this.admin.options().headers};

    (this.overwrite ? axios.put(url, postData, cfg) : axios.post(url, postData, cfg))
        .then((response) => {
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

  public forUser(userid: string, callback: Callback<void>): Admin {
    const path = `/ctx/${userid}/attributes`;
    return this.process(path, callback);
  }

  public forGroup(groupid: string, callback: Callback<void>): Admin {
    const path = `/groups/${groupid}/attributes`;
    return this.process(path, callback);
  }

  public forRoom(roomid: string, callback: Callback<void>): Admin {
    const path = `/rooms/${roomid}/attributes`;
    return this.process(path, callback);
  }
}

interface RoomBuilder {
  attribute(key: string, value: any): RoomBuilder;

  members(first: string, ...others: string[]): RoomBuilder;

  ok(callback?: Callback<string>): Admin;
}

class RoomBuilderImpl implements RoomBuilder {

  private admin: AdminImpl;
  private attributes: { [key: string]: any };
  private appends: string[];

  constructor(admin: AdminImpl) {
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
              .then((response) => {
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

export class AdminImpl extends CommonServiceImpl implements Admin {

  public say(text: string, remark?: string): MessageBuilder {
    return new MessageBuilderImpl(this, text, remark);
  }

  public setAttributes(attributes: Attributes, overwrite?: boolean): AttributeBuilder {
    return new AttributeBuilderImpl(this, attributes, overwrite);
  }

  private static _concat(first: string, ...others): string[] {
    const all: string[] = [];
    all.push(first);
    if (others && others.length > 0) {
      for (const s of others) {
        all.push(s);
      }
    }
    return all;
  }

  public removeMembers(first: string, ...others): MemberRemoveCommand {
    return new MemberRemoveCommandImpl(this, AdminImpl._concat(first, others));
  }

  public appendMembers(first: string, ...others): MemberAppendCommand {
    return new MemberAppendCommandImpl(this, AdminImpl._concat(first, others));
  }

  public create(): CreateCommand {
    return new CreateCommandImpl(this);
  }

  public destroy(): DestroyCommand {
    return new DestroyCommandImpl(this);
  }
}
