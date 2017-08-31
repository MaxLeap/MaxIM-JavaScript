import {Attributes, Callback, ChatRecord, Friend, MyGroup, RoomInfo, UserOutline} from "../model/models";
import {CommonService} from "./common";

/**
 * 聊天记录查询构建器.
 */
interface TalkingBuilder {
  /**
   * 设定为查询好友聊天记录.
   * @param {string} friendid
   * @param {Callback<ChatRecord[]>} callback
   * @return {Context}
   */
  ofFriend(friendid: string, callback?: Callback<ChatRecord[]>): Context;

  /**
   * 设定为查询群组聊天记录.
   * @param {string} groupid
   * @param {Callback<ChatRecord[]>} callback
   * @return {Context}
   */
  ofGroup(groupid: string, callback?: Callback<ChatRecord[]>): Context;

  /**
   * 设定为查询陌生人聊天记录.
   * @param {string} strangerid
   * @param {Callback<ChatRecord[]>} callback
   * @return {Context}
   */
  ofStranger(strangerid: string, callback?: Callback<ChatRecord[]>): Context;

  /**
   * 设定为查询游客聊天记录.
   * @param {string} passengerid
   * @param {Callback<ChatRecord[]>} callback
   * @return {Context}
   */
  ofPassenger(passengerid: string, callback?: Callback<ChatRecord[]>): Context;
}

/**
 * 上下文.
 */
interface Context extends CommonService {

  /**
   * 列出好友详情
   * @param {Callback<Friend[]>} callback
   * @return {Context}
   */
  listFriends(callback?: Callback<Friend[]>): Context;

  /**
   * 列出已加入的群组
   * @param {Callback<MyGroup[]>} callback
   * @return {Context}
   */
  listGroups(callback?: Callback<MyGroup[]>): Context;

  /**
   * 列出已加入的聊天室
   * @param {Callback<RoomInfo[]>} callback
   * @return {Context}
   */
  listRooms(callback?: Callback<RoomInfo[]>): Context;

  /**
   * 列出关联的陌生人列表, 分页查询
   * @param {Callback<UserOutline[]>} callback
   * @param {number} skip
   * @param {number} limit
   * @return {Context}
   */
  listStrangers(callback: Callback<UserOutline[]>, skip?: number, limit?: number): Context;

  /**
   * 查询聊天记录
   * @param {number} endTimestamp
   * @param {number} size
   * @return {TalkingBuilder}
   */
  listTalkings(endTimestamp?: number, size?: number): TalkingBuilder;

  /**
   * 添加好友
   * @param {string} userid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  joinFriend(userid: string, callback?: Callback<void>): Context;

  /**
   * 加入某个群组
   * @param {string} groupid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  joinGroup(groupid: string, callback?: Callback<void>): Context;

  /**
   * 加入某个聊天室
   * @param {string} roomid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  joinRoom(roomid: string, callback?: Callback<void>): Context;

  /**
   * 解除某个好友
   * @param {string} userid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  leaveFriend(userid: string, callback?: Callback<void>): Context;

  /**
   * 离开某个群组
   * @param {string} groupid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  leaveGroup(groupid: string, callback?: Callback<void>): Context;

  /**
   * 离开某个聊天室
   * @param {string} roomid
   * @param {Callback<void>} callback
   * @return {Context}
   */
  leaveRoom(roomid: string, callback?: Callback<void>): Context;

  /**
   * 设置当前上下文用户的属性
   * @param {Attributes} attributes
   * @param {boolean} overwrite
   * @param {Callback<void>} callback
   * @return {Context}
   */
  setMyAttributes(attributes: Attributes, overwrite?: boolean, callback?: Callback<void>): Context;

  /**
   * 设置当前上下文用户的单个属性
   * @param {string} name
   * @param value
   * @param {Callback<void>} callback
   * @return {Context}
   */
  setMyAttribute(name: string, value: any, callback?: Callback<void>): Context;

  /**
   * 获取当前上下文用户的属性列表
   * @param {Callback<Attributes>} callback
   * @return {Context}
   */
  getMyAttributes(callback?: Callback<Attributes>): Context;

  /**
   * 获取当前上下文用户的某个属性
   * @param {string} attributeName
   * @param {Callback} callback
   * @return {Context}
   */
  getMyAttribute(attributeName: string, callback?: Callback<any>): Context;

}

export {
  Context,
  TalkingBuilder,
};
