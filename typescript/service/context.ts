import {Callback, CommonService, successful, APIOptions} from "./common";
import {Friend, MyGroup, RoomInfo, ChatRecord, Attributes} from "../models";
import sortedIndexBy = require("lodash/sortedIndexBy");
import unary = require("lodash/unary");
import isUndefined = require("lodash/isUndefined");

interface TalkingBuilder {
    ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): IContext;
    ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): IContext;
    ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): IContext;
    ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): IContext;
}

interface IContext {

    /**
     * 列出好友详情
     * @param callback
     */
    listFriends(callback?: Callback<Friend[]>): IContext;

    /**
     * 列出已加入的群组
     * @param callback
     */
    listGroups(callback?: Callback<MyGroup[]>): IContext;

    /**
     * 列出已加入的聊天室
     * @param callback
     */
    listRooms(callback?: Callback<RoomInfo[]>): IContext;

    /**
     * 查询聊天记录
     * @param endTimestamp 最后截止时间戳
     * @param size 返回记录数
     */
    listTalkings(endTimestamp?: number, size?: number): TalkingBuilder;

    /**
     * 添加好友
     * @param userid 好友用户ID
     * @param callback
     */
    joinFriend(userid: string, callback?: Callback<boolean>): IContext;
    /**
     * 加入某个群组
     * @param groupid 群组ID
     * @param callback
     */
    joinGroup(groupid: string, callback?: Callback<boolean>): IContext;
    /**
     * 加入某个聊天室
     * @param roomid 聊天室ID
     * @param callback
     */
    joinRoom(roomid: string, callback?: Callback<boolean>): IContext;
    /**
     * 解除某个好友
     * @param userid 好友ID
     * @param callback
     */
    leaveFriend(userid: string, callback?: Callback<boolean>): IContext;
    /**
     * 离开某个群组
     * @param groupid 群组ID
     * @param callback
     */
    leaveGroup(groupid: string, callback?: Callback<boolean>): IContext;
    /**
     * 离开某个聊天室
     * @param roomid 聊天室ID
     * @param callback
     */
    leaveRoom(roomid: string, callback?: Callback<boolean>): IContext;

    /**
     * 设置当前上下文用户的属性
     * @param attributes 属性表
     * @param overwrite 强制覆盖
     * @param callback 回调
     */
    setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): IContext;

    /**
     * 设置当前上下文用户的单个属性
     * @param name 属性名
     * @param value 属性表
     * @param callback 回调
     */
    setMyAttribute(name: string, value: any, callback?: Callback<void>): IContext;

    getMyAttributes(callback?: Callback<Attributes>): IContext;

    getMyAttribute(attributeName: string, callback?: Callback<any>): IContext;

}

/**
 * TalkingBuilder实现类
 */
class TalkingBuilderImpl implements TalkingBuilder {

    private ts: number;
    private size: number;
    private context: IContext;
    private you: string;
    private apiOptions: APIOptions;

    constructor(context: IContext, ts: number, size: number, you: string, apiOptions: APIOptions) {
        this.ts = ts;
        this.size = size;
        this.context = context;
        this.you = you;
        this.apiOptions = apiOptions;
    }

    private listHistories(path: string, callback: Callback<ChatRecord[]>): IContext {
        let url = `${this.apiOptions.server}${path}`;
        let q: string[] = [];
        if (this.ts > 0) {
            q.push(`ts=${this.ts}`);
        }
        if (this.size > 0) {
            q.push(`limit=${this.size}`);
        }
        if (!_.isEmpty(q)) {
            url += '?' + q.join('&');
        }
        let opts = {
            headers: this.apiOptions.headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return response.json();
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .then(result => {
                callback(null, result as ChatRecord[]);
            })
            .catch(e => {
                callback(e);
            });
        return this.context;
    }

    ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): IContext {
        if (!callback) {
            return this.context;
        }
        let path = `/ctx/${this.you}/friends/${friendid}/chats`;
        return this.listHistories(path, callback);
    }

    ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): IContext {
        if (!callback) {
            return this.context;
        }
        let path = `/groups/${groupid}/chats`;
        return this.listHistories(path, callback);
    }

    ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): IContext {
        if (!callback) {
            return this.context;
        }
        let path = `/ctx/${this.you}/strangers/${strangerid}/chats`;
        return this.listHistories(path, callback);
    }

    ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): IContext {
        if (!callback) {
            return this.context;
        }
        let path = `/passengers/${passengerid}/chats/${this.you}`;
        return this.listHistories(path, callback);
    }
}

/**
 * 用户上下文实现类
 */
export class Context extends CommonService implements IContext {

    private you: string;

    constructor(server: string, app: string, sign: string, you: string) {
        super(server, app, sign);
        this.you = you;
    }

    private listSomething<T>(path: string, callback: Callback<T>) {
        let url = `${super.options().server}${path}`;
        let opts = {
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return response.json();
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .then(result => {
                callback(null, result as T);
            })
            .catch(e => {
                callback(e);
            });
        return this;
    }

    public listFriends(callback?: Callback<Friend[]>): IContext {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/friends?detail`;
        return this.listSomething(path, callback);
    }

    public listGroups(callback?: Callback<MyGroup[]>): IContext {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/groups?detail`;
        return this.listSomething(path, callback);
    }

    public listRooms(callback?: Callback<RoomInfo[]>): IContext {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/rooms?detail`;
        return this.listSomething(path, callback);
    }

    public joinFriend(userid: string, callback?: Callback<boolean>): IContext {
        let url = `${super.options().server}/ctx/${this.you}/friends/${userid}`;
        let opts = {
            method: 'POST',
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    if (callback) {
                        callback(null, true);
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

    public joinGroup(groupid: string, callback?: Callback<boolean>): IContext {
        let url = `${super.options().server}/groups/${groupid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    if (callback) {
                        callback(null, true);
                    }
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public joinRoom(roomid: string, callback?: Callback<boolean>): IContext {
        let url = `${super.options().server}/rooms/${roomid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    if (callback) {
                        callback(null, true);
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

    public listTalkings(endTimestamp?: number, size?: number): TalkingBuilder {
        return new TalkingBuilderImpl(this, endTimestamp || 0, size || 0, this.you, super.options());
    }

    private deleteSomething(path: string, callback: Callback<boolean>): IContext {
        let url = `${super.options().server}${path}`;
        let opts = {
            method: 'DELETE',
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return true;
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .then(result => {
                if (callback) {
                    callback(null, result);
                }
            })
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public leaveFriend(userid: string, callback?: Callback<boolean>): IContext {
        let path = `/ctx/${this.you}/friends/${userid}`;
        return this.deleteSomething(path, callback);
    }

    public leaveGroup(groupid: string, callback?: Callback<boolean>): IContext {
        let path = `/groups/${groupid}/members/${this.you}`;
        return this.deleteSomething(path, callback);
    }

    public leaveRoom(roomid: string, callback?: Callback<boolean>): IContext {
        let path = `/rooms/${roomid}/members/${this.you}`;
        return this.deleteSomething(path, callback);
    }

    public setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): IContext {
        let url = `/ctx/${this.you}/attributes`;
        let opts = {
            method: overwrite ? 'PUT' : 'POST',
            body: JSON.stringify(attributes),
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
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public setMyAttribute(name: string, value: any, callback?: Callback<void>): IContext {
        let attributes = {};
        attributes[name] = value;
        return this.setMyAttributes(attributes, false, callback);
    }

    public getMyAttributes(callback?: Callback<Attributes>): IContext {
        if (callback) {
            super.getAttributes(this.you).forUser(callback);
        }
        return this;
    }

    public getMyAttribute(attributeName: string, callback?: Callback<any>): IContext {
        if (callback) {
            super.getAttributes(this.you, attributeName).forUser(callback);
        }
        return this;
    }
}