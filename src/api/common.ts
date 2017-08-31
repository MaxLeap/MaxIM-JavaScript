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

interface AttachmentBuilder {
  ok(callback?: Callback<string[]>);
}

interface CommonService {
  /**
   * 获取当前基础设定
   */
  options(): APIOptions;

  /**
   * 搜索对象
   * @param {{}} query
   * @param {number} skip
   * @param {number} limit
   * @param {string[]} sort
   * @return {SearchBuilder}
   */
  search(query?: { [key: string]: any }, skip?: number, limit?: number, sort?: string[]): SearchBuilder;

  /**
   * 载入对象
   * @param {string} id
   * @return {LoadBuilder}
   */
  load(id: string): LoadBuilder;

  /**
   * 获取属性
   * @param {string} id
   * @param {string} attributeName
   * @return {GetAttributesBuilder}
   */
  getAttributes(id: string, attributeName?: string): GetAttributesBuilder;

  /**
   * 上传附件
   * @param {File | Blob} attachment
   * @return {AttachmentBuilder}
   */
  attachment(attachment: File | Blob): AttachmentBuilder;
}

export {
  SearchBuilder,
  LoadBuilder,
  GetAttributesBuilder,
  AttachmentBuilder,
  CommonService,
};
