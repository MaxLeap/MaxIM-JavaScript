import {UserDetail, GroupInfo, RoomInfo, UserOutline, Passenger} from "../models";

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
    forPassenger(callback: Callback<Passenger>);
}

interface GetAttributesBuilder {
    forUser(callback?: Callback<any>);
    forGroup(callback?: Callback<any>);
    forRoom(callback?: Callback<any>);
}

class GetAttributesBuilderImpl implements GetAttributesBuilder {

    private id: string;
    private attr: string;
    private common: CommonService;

    constructor(common: CommonService, id: string, attr?: string) {
        this.common = common;
        this.id = id;
        this.attr = attr;
    }

    private forAttr(path: string, callback: Callback<any>) {

        let url = `${this.common.options().server}${path}/attributes`;
        if (this.attr) {
            url += `/${this.attr}`;
        }
        let opts = {
            method: 'GET',
            headers: this.common.options().headers
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
                callback(null, result);
            })
            .catch(e => {
                callback(e);
            });
    }

    forUser(callback?: Callback<any>) {
        if (!callback) {
            return;
        }
        this.forAttr(`/ctx/${this.id}`, callback);
    }

    forGroup(callback?: Callback<any>) {
        if (!callback) {
            return;
        }
        this.forAttr(`/groups/${this.id}`, callback);
    }

    forRoom(callback?: Callback<any>) {
        if (!callback) {
            return;
        }
        this.forAttr(`/rooms/${this.id}`, callback);
    }
}

export interface ICommonService {
    /**
     * 搜索对象
     * @param query 查询条件
     * @param skip 跳过记录数
     * @param limit 返回记录条数
     * @param sort 排序
     */
    search(query?: {[key: string]: any}, skip?: number, limit?: number, sort?: string[]): SearchBuilder;
    /**
     * 载入对象
     * @param id 对象ID
     */
    load(id: string): LoadBuilder;

    /**
     * 获取属性
     * @param id
     */
    getAttributes(id: string, attributeName?: string): GetAttributesBuilder;
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

    forPassenger(callback: Callback<Passenger>) {
        this.forSomething('/passengers', callback);
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
                if (callback) {
                    callback(null, results as T);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
    }

    forUsers(callback?: Callback<UserOutline[]>) {
        this.forSomething('/ctx', callback);
    }

    forGroups(callback?: Callback<GroupInfo[]>) {
        this.forSomething('/groups', callback);
    }

    forRooms(callback?: Callback<RoomInfo[]>) {
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

    public getAttributes(id: string, attributeName?: string): GetAttributesBuilder {
        return new GetAttributesBuilderImpl(this, id, attributeName);
    }
}