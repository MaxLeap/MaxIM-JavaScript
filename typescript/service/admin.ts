import {Callback, ICommonService, CommonService, successful} from "./common";
import {SystemMessageTo, Media, Receiver, PushSettings} from "../messages";

interface Admin extends ICommonService {
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
    setAttributes(attributes: {[key: string]: any}, overwrite?: boolean): AttributeBuilder;

    /**
     * 创建聊天室
     */
    createRoom(): RoomBuilder;
    /**
     * 销毁聊天室
     * @param roomid
     * @param callback
     */
    destroyRoom(roomid: string, callback: Callback<void>): Admin;
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

    toAll(): MessageLanucher;
    toUser(userid: string): MessageLanucher;
    toGroup(groupid: string): MessageLanucher;
    toRoom(roomid: string): MessageLanucher;
}

interface MessageLanucher {
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
        if (!_.isUndefined(remark) && !_.isNull(remark)) {
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

    toAll(): MessageLanucher {
        this.receiver = {};
        return new MessageLanucherImpl(this.admin, this.message, this.receiver);
    }

    toUser(userid: string): MessageLanucher {
        this.receiver = {
            id: userid,
            type: Receiver.ACTOR
        };
        return new MessageLanucherImpl(this.admin, this.message, this.receiver);
    }

    toGroup(groupid: string): MessageLanucher {
        this.receiver = {
            id: groupid,
            type: Receiver.GROUP
        };
        return new MessageLanucherImpl(this.admin, this.message, this.receiver);
    }

    toRoom(roomid: string): MessageLanucher {
        this.receiver = {
            id: roomid,
            type: Receiver.ROOM
        };
        return new MessageLanucherImpl(this.admin, this.message, this.receiver);
    }
}

class MessageLanucherImpl implements MessageLanucher {

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

        let opts = {
            method: 'POST',
            headers: this.admin.options().headers,
            body: JSON.stringify(this.message)
        };

        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                } else {
                    throw new Error(`error: ${response.status}`);
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
    private attributes: {[key: string]: any};
    private overwrite: boolean;

    constructor(admin: AdminImpl, attributes: {[key: string]: any}, overwrite?: boolean) {
        this.admin = admin;
        this.attributes = attributes;
        this.overwrite = overwrite || false;
    }

    private process(path: string, callback: Callback<void>): Admin {
        let url = `${this.admin.options().server}${path}`;
        let opts = {
            method: this.overwrite ? 'PUT' : 'POST',
            headers: this.admin.options().headers,
            body: JSON.stringify(this.attributes)
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return response.json();
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .then(() => {
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
            _.each(others, this.appends.push);
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
        let opts = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: op.headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return response.json();
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .then(roomid => {
                let url = `${op.server}/rooms/${roomid}/attributes`;
                let opts = {
                    method: 'POST',
                    body: JSON.stringify(this.attributes),
                    headers: op.headers
                };
                return fetch(url, opts)
                    .then(response => {
                        if (successful(response)) {
                            return roomid;
                        } else {
                            throw new Error(`error : ${response.status}`);
                        }
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

export class AdminImpl extends CommonService implements Admin {

    say(text: string, remark?: string): MessageBuilder {
        return new MessageBuilderImpl(this, text, remark);
    }

    setAttributes(attributes: {}, overwrite?: boolean): AttributeBuilder {
        return new AttributeBuilderImpl(this, attributes, overwrite);
    }

    createRoom(): RoomBuilder {
        return new RoomBuilderImpl(this);
    }

    destroyRoom(roomid: string, callback?: Callback<void>): Admin {
        let url = `${this.options().server}/rooms/${roomid}`;
        let opts = {
            method: 'DELETE',
            headers: this.options().headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    if (callback) {
                        callback(null, null);
                    }
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }
}