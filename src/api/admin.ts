import {Attributes, Callback} from "../model/models";
import {CommonService} from "./common";

interface Admin extends CommonService {
  /**
   * 发送系统消息
   * @param {string} text
   * @param {string} remark
   * @return {MessageBuilder}
   */
  say(text: string, remark?: string): MessageBuilder;

  /**
   * 属性设置
   * @param {Attributes} attributes
   * @param {boolean} overwrite
   * @return {AttributeBuilder}
   */
  setAttributes(attributes: Attributes, overwrite?: boolean): AttributeBuilder;

  /**
   * 创建命令
   * @return {CreateCommand}
   */
  create(): CreateCommand;

  /**
   * 销毁命令
   * @return {DestroyCommand}
   */
  destroy(): DestroyCommand;

  /**
   * 移除成员命令
   * @param {string} first
   * @param {string} others
   * @return {MemberRemoveCommand}
   */
  removeMembers(first: string, ...others: string[]): MemberRemoveCommand;

  /**
   * 追加成员命令
   * @param {string} first
   * @param {string} others
   * @return {MemberAppendCommand}
   */
  appendMembers(first: string, ...others: string[]): MemberAppendCommand;

}

/**
 * 创建命令, 用于简化各种对象的创建过程.
 */
interface CreateCommand {

  /**
   * 创建一个群组.
   * @param {string} owner
   * @return {GroupBuilder}
   */
  group(owner: string): GroupBuilder;

  /**
   * 创建一个聊天室.
   * @return {RoomBuilder}
   */
  room(): RoomBuilder;
}

/**
 * 销毁命令, 用于简化各种对象的销毁过程.
 */
interface DestroyCommand {

  /**
   * 销毁一个群组.
   * @param {string} groupid
   * @return {GroupDestroy}
   */
  group(groupid: string): GroupDestroy;

  /**
   * 销毁一个聊天室.
   * @param {string} roomid
   * @return {RoomDestroy}
   */
  room(roomid: string): RoomDestroy;
}

/**
 * 群组销毁器.
 */
interface GroupDestroy {
  /**
   * 提交执行.
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  ok(callback?: Callback<void>): Admin;
}

/**
 * 聊天室销毁器.
 */
interface RoomDestroy {
  /**
   * 提交执行.
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  ok(callback?: Callback<void>): Admin;
}

/**
 * 群组构建器.
 */
interface GroupBuilder {
  /**
   * 设定属性.
   * @param {string} key
   * @param value
   * @return {GroupBuilder}
   */
  attribute(key: string, value: any): GroupBuilder;

  /**
   * 设定成员.
   * @param {string} first
   * @param {string} others
   * @return {GroupBuilder}
   */
  members(first: string, ...others: string[]): GroupBuilder;

  /**
   * 提交执行.
   * @param {Callback<string>} callback
   * @return {Admin}
   */
  ok(callback?: Callback<string>): Admin;
}

/**
 * 成员添加命令
 */
interface MemberAppendCommand {
  /**
   * 设定添加到聊天室.
   * @param {string} roomid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  intoRoom(roomid: string, callback?: Callback<void>): Admin;

  /**
   * 设定添加到群组.
   * @param {string} groupid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  intoGroup(groupid: string, callback?: Callback<void>): Admin;
}

/**
 * 成员移除命令.
 */
interface MemberRemoveCommand {

  /**
   * 设定从聊天室中移除.
   * @param {string} roomid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  fromRoom(roomid: string, callback?: Callback<void>): Admin;

  /**
   * 设定从群组中移除.
   * @param {string} groupid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  fromGroup(groupid: string, callback?: Callback<void>): Admin;
}

/**
 * 消息构建器
 */
interface MessageBuilder {

  asText(): MessageBuilder;

  asImage(): MessageBuilder;

  asAudio(): MessageBuilder;

  asVideo(): MessageBuilder;

  disablePush(): MessageBuilder;

  setPushSound(sound: string): MessageBuilder;

  setPushBadge(badge: number): MessageBuilder;

  setPushContentAvailable(contentAvailable: boolean): MessageBuilder;

  setPushPrefix(prefix: string): MessageBuilder;

  setPushSuffix(suffix: string): MessageBuilder;

  setPushTextOverwrite(text: string): MessageBuilder;

  toAll(): MessageLauncher;

  toUser(userid: string): MessageLauncher;

  toGroup(groupid: string): MessageLauncher;

  toRoom(roomid: string): MessageLauncher;
}

/**
 * 消息发射器.
 */
interface MessageLauncher {
  ok(callback?: Callback<void>): Admin;
}

/**
 * 属性构建器.
 */
interface AttributeBuilder {

  /**
   * 设定对象为用户.
   * @param {string} userid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  forUser(userid: string, callback?: Callback<void>): Admin;

  /**
   * 设定对象为群组.
   * @param {string} groupid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  forGroup(groupid: string, callback?: Callback<void>): Admin;

  /**
   * 设定对象为聊天室.
   * @param {string} roomid
   * @param {Callback<void>} callback
   * @return {Admin}
   */
  forRoom(roomid: string, callback?: Callback<void>): Admin;
}

interface RoomBuilder {
  attribute(key: string, value: any): RoomBuilder;

  members(first: string, ...others: string[]): RoomBuilder;

  ok(callback?: Callback<string>): Admin;
}

export {
  CreateCommand,
  DestroyCommand,
  GroupDestroy,
  RoomDestroy,
  GroupBuilder,
  MemberAppendCommand,
  MemberRemoveCommand,
  MessageBuilder,
  MessageLauncher,
  AttributeBuilder,
  RoomBuilder,
  Admin,
};
