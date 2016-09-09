import {Callback, CommonService, successful} from "./common";
import {Friend, MyGroup, RoomInfo} from "../models";
import sortedIndexBy = require("lodash/sortedIndexBy");

interface IContext {
    listFriends(callback: Callback<Friend[]>): IContext;
    listGroups(callback: Callback<MyGroup[]>): IContext;
    listRooms(callback: Callback<RoomInfo[]>): IContext;
}

export class Context extends CommonService implements IContext {

    you: string;

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

    listFriends(callback: Callback<Friend[]>): IContext {
        let path = `/ctx/${this.you}/friends?detail`;
        return this.listSomething(path, callback);
    }

    listGroups(callback: Callback<MyGroup[]>): IContext {
        let path = `/ctx/${this.you}/groups?detail`;
        return this.listSomething(path, callback);
    }

    listRooms(callback: Callback<RoomInfo[]>): IContext {
        let path = `/ctx/${this.you}/rooms?detail`;
        return this.listSomething(path, callback);
    }

}