import axios = require("axios");
import {APIOptions, Callback, GroupInfo, Passenger, RoomInfo, UserDetail, UserOutline} from "../model/models";

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
  search(query?: { [key: string]: any }, skip?: number, limit?: number, sort?: string[]): SearchBuilder;

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
  attachment(attachment: File | Blob): AttachmentBuilder;
}

interface AttachmentBuilder {
  ok(callback?: Callback<string[]>);
}

interface LoadOptions {
  id: string;
}

interface SearchOptions {
  query?: { [key: string]: any };
  skip?: number;
  limit?: number;
  sort?: string[];
}

class AttachmentBuilderImpl implements AttachmentBuilder {

  private apiOptions: APIOptions;
  private attachment: File | Blob;

  constructor(apiOptions: APIOptions, attachment: File | Blob) {
    this.apiOptions = apiOptions;
    this.attachment = attachment;
  }

  public ok(callback?: Callback<string[]>): void {
    const data: FormData = new FormData();
    data.append("attachment", this.attachment);
    const url = `${this.apiOptions.server}/attachment`;
    const header: { [key: string]: string } = {};
    for (const k in this.apiOptions.headers) {
      if (k.toLowerCase() !== "content-type") {
        header[k] = this.apiOptions.headers[k];
      }
    }

    axios.post(url, data, {headers: header})
        .then((response) => {
          return response.data as string[];
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
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

    axios.get(url, {headers: this.common.options().headers})
        .then((response) => {
          return response.data as string;
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
  }

  public forUser(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/ctx/${this.id}`, callback);
  }

  public forGroup(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/groups/${this.id}`, callback);
  }

  public forRoom(callback?: Callback<any>) {
    if (!callback) {
      return;
    }
    this.forAttr(`/rooms/${this.id}`, callback);
  }
}

class Builder<T> {
  public apiOptions: APIOptions;
  public extOptions: T;

  constructor(apiOptions: APIOptions, extOptions?: T) {
    this.apiOptions = apiOptions;
    this.extOptions = extOptions;
  }
}

class LoadBuilderImpl extends Builder<LoadOptions> implements LoadBuilder {

  private forSomething<T>(path: string, callback: Callback<T>) {
    const url = `${this.apiOptions.server}${path}/${this.extOptions.id}`;

    axios.post(url, null, {headers: this.apiOptions.headers})
        .then((response) => {
          return response.data as T;
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
  }

  public forUser(callback: Callback<UserDetail>) {
    this.forSomething("/ctx", callback);
  }

  public forGroup(callback: Callback<GroupInfo>) {
    this.forSomething("/groups", callback);
  }

  public forRoom(callback: Callback<RoomInfo>) {
    this.forSomething("/rooms", callback);
  }

  public forPassenger(callback: Callback<Passenger>) {
    this.forSomething("/passengers", callback);
  }
}

class SearchBuilderImpl extends Builder<SearchOptions> implements SearchBuilder {

  private getUrl(path: string): string {
    const q: string[] = [];
    for (const k in this.extOptions.query) {
      const v = this.extOptions.query[k];
      q.push(`${k}=${v}`);
    }
    q.push(`_skip=${this.extOptions.skip || 0}`);
    q.push(`_limit=${this.extOptions.limit || 20}`);
    return `${this.apiOptions.server}${path}?${q.join("&")}`;
  }

  private forSomething<T>(path: string, callback: Callback<T>) {
    const url = this.getUrl(path);

    axios.get(url, {headers: this.apiOptions.headers})
        .then((response) => {
          return response.data as T;
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
  }

  public forUsers(callback?: Callback<UserOutline[]>) {
    this.forSomething("/ctx", callback);
  }

  public forGroups(callback?: Callback<GroupInfo[]>) {
    this.forSomething("/groups", callback);
  }

  public forRooms(callback?: Callback<RoomInfo[]>) {
    this.forSomething("/rooms", callback);
  }
}

class CommonServiceImpl implements CommonService {

  private _options: APIOptions;

  constructor(apiOptions: APIOptions) {
    this._options = apiOptions;
  }

  public options(): APIOptions {
    return this._options;
  }

  public search(query?: {}, skip?: number, limit?: number, sort?: string[]): SearchBuilder {
    const searchOptions: SearchOptions = {
      limit,
      skip,
      query,
      sort,
    };
    return new SearchBuilderImpl(this._options, searchOptions);
  }

  public load(id: string): LoadBuilder {
    const opts = {
      id,
    };
    return new LoadBuilderImpl(this._options, opts);
  }

  public getAttributes(id: string, attributeName?: string): GetAttributesBuilder {
    return new GetAttributesBuilderImpl(this, id, attributeName);
  }

  public attachment(attachment: File): AttachmentBuilder {
    return new AttachmentBuilderImpl(this._options, attachment);
  }
}

export {
  CommonService,
  CommonServiceImpl,
};
