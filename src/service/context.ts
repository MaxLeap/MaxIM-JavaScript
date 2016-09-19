import {CommonServiceImpl, CommonService} from "./common";
import {Friend, MyGroup, RoomInfo, ChatRecord, Attributes, APIOptions, Callback, UserOutline} from "../model/models";
import * as fetch from "isomorphic-fetch";
import {ParrotError} from "../helper/utils";

interface TalkingBuilder {
    ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): Context;
    ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): Context;
    ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): Context;
    ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): Context;
}

export interface Context extends CommonService {

    /**
     * 列出好友详情
     * @param callback
     */
    listFriends(callback?: Callback<Friend[]>): Context;

    /**
     * 列出已加入的群组
     * @param callback
     */
    listGroups(callback?: Callback<MyGroup[]>): Context;

    /**
     * 列出已加入的聊天室
     * @param callback
     */
    listRooms(callback?: Callback<RoomInfo[]>): Context;

    /**
     * 列出关联的陌生人列表, 分页查询
     * @param callback
     * @param skip
     * @param limit
     */
    listStrangers(callback: Callback<UserOutline[]>, skip?: number, limit?: number): Context;

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
    joinFriend(userid: string, callback?: Callback<void>): Context;
    /**
     * 加入某个群组
     * @param groupid 群组ID
     * @param callback
     */
    joinGroup(groupid: string, callback?: Callback<void>): Context;
    /**
     * 加入某个聊天室
     * @param roomid 聊天室ID
     * @param callback
     */
    joinRoom(roomid: string, callback?: Callback<void>): Context;
    /**
     * 解除某个好友
     * @param userid 好友ID
     * @param callback
     */
    leaveFriend(userid: string, callback?: Callback<void>): Context;
    /**
     * 离开某个群组
     * @param groupid 群组ID
     * @param callback
     */
    leaveGroup(groupid: string, callback?: Callback<void>): Context;
    /**
     * 离开某个聊天室
     * @param roomid 聊天室ID
     * @param callback
     */
    leaveRoom(roomid: string, callback?: Callback<void>): Context;

    /**
     * 设置当前上下文用户的属性
     * @param attributes 属性表
     * @param overwrite 强制覆盖
     * @param callback 回调
     */
    setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): Context;

    /**
     * 设置当前上下文用户的单个属性
     * @param name 属性名
     * @param value 属性表
     * @param callback 回调
     */
    setMyAttribute(name: string, value: any, callback?: Callback<void>): Context;

    /**
     * 获取当前上下文用户的属性列表
     * @param callback
     */
    getMyAttributes(callback?: Callback<Attributes>): Context;

    /**
     * 获取当前上下文用户的某个属性
     * @param attributeName
     * @param callback
     */
    getMyAttribute(attributeName: string, callback?: Callback<any>): Context;

}

/**
 * TalkingBuilder实现类
 */
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

    private listHistories(path: string, callback: Callback<ChatRecord[]>): Context {
        let url = `${this.apiOptions.server}${path}`;
        let q: string[] = [];
        if (this.ts > 0) {
            q.push(`ts=${this.ts}`);
        }
        if (this.size > 0) {
            q.push(`limit=${this.size}`);
        }

        if (q.length > 0) {
            url += '?' + q.join('&');
        }
        let opts = {
            headers: this.apiOptions.headers
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, res[1] as ChatRecord[]);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this.context;
    }

    ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): Context {
        if (!callback) {
            return this.context;
        }
        let path = `/ctx/${this.you}/friends/${friendid}/chats`;
        return this.listHistories(path, callback);
    }

    ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): Context {
        if (!callback) {
            return this.context;
        }
        let path = `/groups/${groupid}/chats`;
        return this.listHistories(path, callback);
    }

    ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): Context {
        if (!callback) {
            return this.context;
        }
        let path = `/ctx/${this.you}/strangers/${strangerid}/chats`;
        return this.listHistories(path, callback);
    }

    ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): Context {
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
export class ContextImpl extends CommonServiceImpl implements Context {

    private you: string;

    constructor(apiOptions: APIOptions, you: string) {
        super(apiOptions);
        this.you = you;
    }

    private listSomething<T>(path: string, callback: Callback<T>) {
        let url = `${super.options().server}${path}`;
        let opts = {
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, res[1] as T);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public listFriends(callback?: Callback<Friend[]>): Context {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/friends?detail`;
        return this.listSomething(path, callback);
    }

    public listGroups(callback?: Callback<MyGroup[]>): Context {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/groups?detail`;
        return this.listSomething(path, callback);
    }

    public listRooms(callback?: Callback<RoomInfo[]>): Context {
        if (!callback) {
            return this;
        }
        let path = `/ctx/${this.you}/rooms?detail`;
        return this.listSomething(path, callback);
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
        let url = `${super.options().server}/ctx/${this.you}/friends/${userid}`;
        let opts = {
            method: 'POST',
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, null);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public joinGroup(groupid: string, callback?: Callback<void>): Context {
        let url = `${super.options().server}/groups/${groupid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, null);
                }
            })
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public joinRoom(roomid: string, callback?: Callback<void>): Context {
        let url = `${super.options().server}/rooms/${roomid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, null);
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

    private deleteSomething(path: string, callback: Callback<void>): Context {
        let url = `${super.options().server}${path}`;
        let opts = {
            method: 'DELETE',
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, null);
                }
            })
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public leaveFriend(userid: string, callback?: Callback<void>): Context {
        let path = `/ctx/${this.you}/friends/${userid}`;
        return this.deleteSomething(path, callback);
    }

    public leaveGroup(groupid: string, callback?: Callback<void>): Context {
        let path = `/groups/${groupid}/members/${this.you}`;
        return this.deleteSomething(path, callback);
    }

    public leaveRoom(roomid: string, callback?: Callback<void>): Context {
        let path = `/rooms/${roomid}/members/${this.you}`;
        return this.deleteSomething(path, callback);
    }

    public setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): Context {
        let url = `/ctx/${this.you}/attributes`;
        let opts = {
            method: overwrite ? 'PUT' : 'POST',
            body: JSON.stringify(attributes),
            headers: this.options().headers
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, null);
                }
            })
            .catch(e=> {
                if (callback) {
                    callback(e);
                }
            });
        return this;
    }

    public setMyAttribute(name: string, value: any, callback?: Callback<void>): Context {
        let attributes = {};
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
}