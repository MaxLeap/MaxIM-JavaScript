import {UserDetail, GroupInfo, RoomInfo, UserOutline, Passenger, APIOptions, Callback} from "../model/models";
import * as fetch from "isomorphic-fetch";
import {ParrotError} from "../helper/utils";

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

interface CommonService {
    /**
     * 获取当前基础设定
     */
    options(): APIOptions;
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

    /**
     * 上传附件
     * @param attachment
     */
    attachment(attachment: File|Blob): AttachmentBuilder;
}

interface AttachmentBuilder {
    ok(callback?: Callback<string[]>);
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

class AttachmentBuilderImpl implements AttachmentBuilder {

    private apiOptions: APIOptions;
    private attachment: File|Blob;

    constructor(apiOptions: APIOptions, attachment: File|Blob) {
        this.apiOptions = apiOptions;
        this.attachment = attachment;
    }

    ok(callback?: Callback<string[]>): void {
        let data: FormData = new FormData();
        data.append('attachment', this.attachment);
        let url = `${this.apiOptions.server}/attachment`;
        let header: {[key: string]: string} = {};
        for (let k in this.apiOptions.headers) {
            if (k.toLowerCase() !== 'content-type') {
                header[k] = this.apiOptions.headers[k];
            }
        }
        // header['content-type'] = 'multipart/form-data';
        let opts = {
            method: 'POST',
            headers: header,
            body: data
        };
        fetch(url, opts)
            .then(response => {
                return response.json().then(json => [response.ok, json]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, res[1] as string[]);
                }
            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
            });
    }
}

class GetAttributesBuilderImpl implements GetAttributesBuilder {

    private id: string;
    private attr: string;
    private common: CommonServiceImpl;

    constructor(common: CommonServiceImpl, id: string, attr?: string) {
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
                return response.json().then(result => [response.ok, result]);
            })
            .then(res => {
                if (!res[0]) {
                    throw new ParrotError(res[1]);
                } else if (callback) {
                    callback(null, res[1]);
                }

            })
            .catch(e => {
                if (callback) {
                    callback(e);
                }
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
        for (let k in this.extOptions.query) {
            let v = this.extOptions.query[k];
            q.push(`${k}=${v}`);
        }
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

class CommonServiceImpl implements CommonService {


    private _options: APIOptions;

    constructor(apiOptions: APIOptions) {
        this._options = apiOptions;
    }

    options(): APIOptions {
        return this._options;
    }

    search(query?: {}, skip?: number, limit?: number, sort?: string[]): SearchBuilder {
        let searchOptions: SearchOptions = {
            limit: limit,
            skip: skip,
            query: query,
            sort: sort
        };
        return new SearchBuilderImpl(this._options, searchOptions);
    }

    load(id: string): LoadBuilder {
        let opts = {
            id: id
        };
        return new LoadBuilderImpl(this._options, opts);
    }

    getAttributes(id: string, attributeName?: string): GetAttributesBuilder {
        return new GetAttributesBuilderImpl(this, id, attributeName);
    }

    attachment(attachment: File): AttachmentBuilder {
        return new AttachmentBuilderImpl(this._options, attachment);
    }
}

export {
    CommonService,
    CommonServiceImpl
}