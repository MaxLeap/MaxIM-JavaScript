import {UserDetail, GroupInfo, RoomInfo, UserOutline} from "../models";

export interface Callback<T> {
    (err: Error, data?: T): void;
}

interface SearchBuilder {
    forUsers(callback: Callback<UserOutline[]>);
    forGroups(callback: Callback<GroupInfo[]>);
    forRooms(callback: Callback<RoomInfo[]>);
}

interface LoadBuilder {
    forUser(callback: Callback<UserDetail>);
    forGroup(callback: Callback<GroupInfo>);
    forRoom(callback: Callback<RoomInfo>);
}

export interface ICommonService {
    // search something
    search(query?: {[key: string]: any}, skip?: number, limit?: number, sort?: string[]): SearchBuilder;
    // load something
    load(id: string): LoadBuilder;
}

export interface APIOptions {
    server: string;
    app: string;
    sign: string;
    headers: {[key: string]: string};
}

interface LoadOptions {
    id: string;
}

interface SearchOptions {
    query?: {[key: string]: any};
    skip?: number;
    limit?: number;
    sort?: string[];
}

export function successful(response: Response): boolean {
    return response.status > 199 && response.status < 300;
}

class Builder<T> {
    apiOptions: APIOptions;
    extOptions: T;

    constructor(apiOptions: APIOptions, extOptions?: T) {
        this.apiOptions = apiOptions;
        this.extOptions = extOptions;
    }
}

class LoadBuilderImpl extends Builder<LoadOptions> implements LoadBuilder {

    private forSomething<T>(path: string, callback: Callback<T>) {
        let url = `${this.apiOptions.server}${path}/${this.extOptions.id}`;

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
                callback(null, result as T);
            })
            .catch(e => {
                callback(e);
            });
    }

    forUser(callback: Callback<UserDetail>) {
        this.forSomething('/ctx', callback);
    }

    forGroup(callback: Callback<GroupInfo>) {
        this.forSomething('/groups', callback);
    }

    forRoom(callback: Callback<RoomInfo>) {
        this.forSomething('/rooms', callback);
    }
}

class SearchBuilderImpl extends Builder<SearchOptions> implements SearchBuilder {

    private getUrl(path: string): string {
        let q: string[] = [];
        _.each(this.extOptions.query, (v, k) => {
            q.push(`${k}=${v}`);
        });
        q.push(`_skip=${this.extOptions.skip || 0}`);
        q.push(`_limit=${this.extOptions.limit || 20}`);
        return `${this.apiOptions.server}${path}?${q.join('&')}`;
    }

    private forSomething<T>(path: string, callback: Callback<T>) {
        let url = this.getUrl(path);
        let opts = {
            headers: this.apiOptions.headers
        };
        fetch(url, opts)
            .then(response => {
                if (successful(response)) {
                    return response.json();
                } else {
                    throw new Error(`err: ${response.status}`);
                }
            })
            .then(results => {
                callback(null, results as T);
            })
            .catch(e => {
                callback(e);
            });
    }

    forUsers(callback: Callback<UserOutline[]>) {
        this.forSomething('/ctx', callback);
    }

    forGroups(callback: Callback<GroupInfo[]>) {
        this.forSomething('/groups', callback);
    }

    forRooms(callback: Callback<RoomInfo[]>) {
        this.forSomething('/rooms', callback);
    }
}

export class CommonService implements ICommonService {

    private _options: APIOptions;

    constructor(server: string, app: string, sign: string) {
        this._options = {
            server: server,
            app: app,
            sign: sign,
            headers: {
                'x-ml-appid': app,
                'x-ml-apikey': sign,
                'content-type': 'application/json; charset=utf-8'
            }
        };
    }

    public options(): APIOptions {
        return this._options;
    }

    public search(query?: {}, skip?: number, limit?: number, sort?: string[]): SearchBuilder {
        let searchOptions: SearchOptions = {
            limit: limit,
            skip: skip,
            query: query,
            sort: sort
        };
        return new SearchBuilderImpl(this._options, searchOptions);
    }

    public load(id: string): LoadBuilder {
        let opts = {
            id: id
        };
        return new LoadBuilderImpl(this._options, opts);
    }

}