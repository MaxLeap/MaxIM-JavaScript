import {Callback, CommonService, successful, APIOptions} from "./common";
import {Friend, MyGroup, RoomInfo} from "../models";
import sortedIndexBy = require("lodash/sortedIndexBy");
import unary = require("lodash/unary");
import isUndefined = require("lodash/isUndefined");


interface TalkingBuilder {
    ofFriend(friendid: string, callback: Callback<History[]>): IContext;
    ofGroup(groupid: string, callback: Callback<History[]>): IContext;
    ofStranger(strangerid: string, callback: Callback<History[]>): IContext;
}

interface IContext {
    listFriends(callback: Callback<Friend[]>): IContext;
    listGroups(callback: Callback<MyGroup[]>): IContext;
    listRooms(callback: Callback<RoomInfo[]>): IContext;

    listTalkings(endTimestamp?: number, size?: number): TalkingBuilder;

    makeFriend(userid: string, callback: Callback<boolean>): IContext;
    joinGroup(groupid: string, callback: Callback<boolean>): IContext;
    joinRoom(roomid: string, callback: Callback<boolean>): IContext;
}

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

    private listHistories(path: string, callback: Callback<History[]>): IContext {
        let url = `${this.apiOptions.server}${path}?size=${this.size}&ts=${this.ts}`;
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
                callback(null, result as History[]);
            })
            .catch(e => {
                callback(e);
            });
        return this.context;
    }

    ofFriend(friendid: string, callback: Callback<History[]>): IContext {
        let path = `/ctx/${this.you}/friends/${friendid}/chats`;
        return this.listHistories(path, callback);
    }

    ofGroup(groupid: string, callback: Callback<History[]>): IContext {
        let path = `/groups/${groupid}/chats`;
        return this.listHistories(path, callback);
    }

    ofStranger(strangerid: string, callback: Callback<History[]>): IContext {
        let path = `/ctx/${this.you}/strangers/${strangerid}/chats`;
        return this.listHistories(path, callback);
    }
}

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

    public listFriends(callback: Callback<Friend[]>): IContext {
        let path = `/ctx/${this.you}/friends?detail`;
        return this.listSomething(path, callback);
    }

    public listGroups(callback: Callback<MyGroup[]>): IContext {
        let path = `/ctx/${this.you}/groups?detail`;
        return this.listSomething(path, callback);
    }

    public listRooms(callback: Callback<RoomInfo[]>): IContext {
        let path = `/ctx/${this.you}/rooms?detail`;
        return this.listSomething(path, callback);
    }

    public makeFriend(userid: string, callback: Callback<boolean>): IContext {
        let url = `${super.options().server}/ctx/${this.you}/friends/${userid}`;
        let opts = {
            method: 'POST',
            headers: super.options().headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    callback(null, true);
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .catch(e => {
                callback(e);
            });
        return this;
    }

    public joinGroup(groupid: string, callback: Callback<boolean>): IContext {
        let url = `${super.options().server}/groups/${groupid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    callback(null, true);
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .catch(e=> {
                callback(e);
            });
        return this;
    }

    public joinRoom(roomid: string, callback: Callback<boolean>): IContext {
        let url = `${super.options().server}/rooms/${roomid}/members/${this.you}`;

        let opts = {
            method: 'POST',
            headers: super.options().headers
        };

        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    callback(null, true);
                } else {
                    throw new Error(`error: ${response.status}`);
                }
            })
            .catch(e => {
                callback(e);
            });
        return this;
    }

    public listTalkings(endTimestamp?: number, size?: number): TalkingBuilder {
        return new TalkingBuilderImpl(this, endTimestamp || 0, size || 20, this.you, super.options());
    }

}