import {CommonService, CommonServiceImpl} from "./common";
import {SystemMessageTo, Media, Receiver, PushSettings} from "../model/messages";
import {Attributes, Callback} from "../model/models";
import axios = require("axios");
import ResponseInterceptor = Axios.ResponseInterceptor;

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

    ok(callback?: Callback<void>): Admin {
        let url = `${this.admin.options().server}/groups/${this.groupid}`;

        axios.delete(url, {headers: this.admin.options().headers})
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
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

    ok(callback?: Callback<void>): Admin {
        let url = `${this.admin.options().server}/rooms/${this.roomid}`;

        axios.delete(url, {headers: this.admin.options().headers})
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
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

    group(groupid: string): GroupDestroy {
        return new GroupDestroyImpl(this.admin, groupid);
    }

    room(roomid: string): RoomDestroy {
        return new RoomDestroyImpl(this.admin, roomid);
    }
}


class CreateCommandImpl implements CreateCommand {

    private admin: AdminImpl;

    constructor(admin: AdminImpl) {
        this.admin = admin;
    }

    group(owner: string): GroupBuilder {
        return new GroupBuilderImpl(this.admin, owner);
    }

    room(): RoomBuilder {
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

    attribute(key: string, value: any): GroupBuilder {
        if (!this.attributes) {
            this.attributes = {};
        }
        this.attributes[key] = value;
        return this;
    }

    members(first: string, others: string): GroupBuilder {
        this.appends.push(first);
        if (others && others.length > 0) {
            for (let s of others) {
                this.appends.push(s);
            }
        }
        return this;
    }

    ok(callback?: Callback<string>): Admin {
        let url = `${this.admin.options().server}/groups`;
        let data = {
            owner: this.owner,
            members: this.appends
        };

        axios.post(url, JSON.stringify(data), {headers: this.admin.options().headers})
            .then(response => {
                return response.data as string;
            })
            .then(groupid => {
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
            .catch(e => {
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
        members: string[]
    };

    constructor(admin: AdminImpl, members: string[]) {
        this.admin = admin;
        this.members = {
            members: members
        };
    }

    private _append(path: string, callback?: Callback<void>): Admin {
        let url = `${this.admin.options().server}${path}/members`;
        axios.post(url, JSON.stringify(this.members), {headers: this.admin.options().headers})
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this.admin;
    }

    intoRoom(roomid: string, callback?: Callback<void>): Admin {
        return this._append(`/rooms/${roomid}`, callback);
    }

    intoGroup(groupid: string, callback?: Callback<void>): Admin {
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
            members: members
        };
    }

    private _delete(path: string, callback?: Callback<void>): Admin {
        let op = this.admin.options();
        let url = `${op.server}${path}/members`;
        let req = {
            url: url,
            method: 'DELETE',
            data: JSON.stringify(this.members),
            headers: op.headers
        };
        axios.request(req)
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this.admin;
    }

    fromRoom(roomid: string, callback?: Callback<void>): Admin {
        return this._delete(`/rooms/${roomid}`, callback);
    }

    fromGroup(groupid: string, callback?: Callback<void>): Admin {
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
                body: text
            }
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

    disablePush(): MessageBuilder {
        this.touchPush().enable = false;
        return this;
    }

    setPushSound(sound: string): MessageBuilder {
        this.touchPush().sound = sound;
        return this;
    }

    setPushBadge(badge: number): MessageBuilder {
        this.touchPush().badge = badge;
        return this;
    }

    setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
        this.touchPush().contentAvailable = contentAvailable;
        return this;
    }

    setPushPrefix(prefix: string): MessageBuilder {
        this.touchPush().prefix = prefix;
        return this;
    }

    setPushSuffix(suffix: string): MessageBuilder {
        this.touchPush().suffix = suffix;
        return this;
    }

    setPushTextOverwrite(text: string): MessageBuilder {
        this.touchPush().overwrite = text;
        return this;
    }

    asText(): MessageBuilder {
        this.message.content.media = Media.TEXT;
        return this;
    }

    asImage(): MessageBuilder {
        this.message.content.media = Media.IMAGE;
        return this;
    }

    asAudio(): MessageBuilder {
        this.message.content.media = Media.AUDIO;
        return undefined;
    }

    asVideo(): MessageBuilder {
        this.message.content.media = Media.VIDEO;
        return undefined;
    }

    toAll(): MessageLauncher {
        this.receiver = {};
        return new MessageLauncherImpl(this.admin, this.message, this.receiver);
    }

    toUser(userid: string): MessageLauncher {
        this.receiver = {
            id: userid,
            type: Receiver.ACTOR
        };
        return new MessageLauncherImpl(this.admin, this.message, this.receiver);
    }

    toGroup(groupid: string): MessageLauncher {
        this.receiver = {
            id: groupid,
            type: Receiver.GROUP
        };
        return new MessageLauncherImpl(this.admin, this.message, this.receiver);
    }

    toRoom(roomid: string): MessageLauncher {
        this.receiver = {
            id: roomid,
            type: Receiver.ROOM
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

    constructor(admin: AdminImpl, message: SystemMessageTo, receiver: {type?: Receiver;id?: string}) {
        this.admin = admin;
        this.message = message;
        this.receiver = receiver;
    }

    ok(callback?: Callback<void>): Admin {
        let url = `${this.admin.options().server}/system`;

        if (this.receiver.id) {
            url += `/${this.receiver.id}`;
            switch (this.receiver.type) {
                case Receiver.GROUP:
                    url += '?group';
                    break;
                case Receiver.ROOM:
                    url += '?room';
                    break;
                default:
                    break;
            }
        }

        axios.post(url, JSON.stringify(this.message), {headers: this.admin.options().headers})
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
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
        let url = `${this.admin.options().server}${path}`;
        let postData = JSON.stringify(this.attributes);
        let cfg = {headers: this.admin.options().headers};

        (this.overwrite ? axios.put(url, postData, cfg) : axios.post(url, postData, cfg))
            .then(response => {
                if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this.admin;
    }

    forUser(userid: string, callback: Callback<void>): Admin {
        let path = `/ctx/${userid}/attributes`;
        return this.process(path, callback);
    }

    forGroup(groupid: string, callback: Callback<void>): Admin {
        let path = `/groups/${groupid}/attributes`;
        return this.process(path, callback);
    }

    forRoom(roomid: string, callback: Callback<void>): Admin {
        let path = `/rooms/${roomid}/attributes`;
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
    private attributes: { [key: string]: any};
    private appends: string[];

    constructor(admin: AdminImpl) {
        this.admin = admin;
        this.attributes = {};
        this.appends = [];
    }

    members(first: string, ...others: string[]): RoomBuilder {
        this.appends.push(first);
        if (others) {
            for (let s of others) {
                this.appends.push(s);
            }
        }
        return this;
    }

    attribute(key: string, value: any): RoomBuilder {
        this.attributes[key] = value;
        return this;
    }

    ok(callback?: Callback<string>): Admin {
        let op = this.admin.options();
        let url = `${op.server}/rooms`;
        let body = {
            members: this.appends
        };

        let config = {headers: op.headers};
        axios.post(url, JSON.stringify(body), config)
            .then(response => {
                return response.data as string;
            })
            .then(roomid => {
                let url2 = `${op.server}/rooms/${roomid}/attributes`;
                let postData = JSON.stringify(this.attributes);
                return axios.post(url2, postData, {headers: op.headers})
                    .then(response => {
                        return roomid;
                    });
            })
            .then(roomid => {
                if (callback) {
                    callback(null, roomid);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this.admin;
    }
}

export class AdminImpl extends CommonServiceImpl implements Admin {

    say(text: string, remark?: string): MessageBuilder {
        return new MessageBuilderImpl(this, text, remark);
    }

    setAttributes(attributes: Attributes, overwrite?: boolean): AttributeBuilder {
        return new AttributeBuilderImpl(this, attributes, overwrite);
    }

    private static _concat(first: string, ...others): string[] {
        let all: string[] = [];
        all.push(first);
        if (others && others.length > 0) {
            for (let s of others) {
                all.push(s);
            }
        }
        return all;
    }

    removeMembers(first: string, ...others): MemberRemoveCommand {
        return new MemberRemoveCommandImpl(this, AdminImpl._concat(first, others));
    }

    appendMembers(first: string, ...others): MemberAppendCommand {
        return new MemberAppendCommandImpl(this, AdminImpl._concat(first, others));
    }

    create(): CreateCommand {
        return new CreateCommandImpl(this);
    }

    destroy(): DestroyCommand {
        return new DestroyCommandImpl(this);
    }
}