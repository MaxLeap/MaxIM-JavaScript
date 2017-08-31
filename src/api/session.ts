import {BasicMessageFrom, SystemMessageFrom, YourselfMessageFrom} from "../model/messages";
import {Callback, Callback2, Handler1, Handler2, Handler3} from "../model/models";
import {Context} from "./context";

interface MessageBuilder {

  ack(ack: number): MessageBuilder;

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

  toFriend(friend: string): MessageLauncher;

  toGroup(groupid: string): MessageLauncher;

  toRoom(roomid: string): MessageLauncher;

  toPassenger(passengerid: string): MessageLauncher;

  toStranger(strangerid: string): MessageLauncher;
}

interface MessageLauncher {
  ok(callback?: Callback<void>): Session;
}

interface Session {
  current(): string;

  say(text: string, remark?: string): MessageBuilder;

  close(callback?: Callback<void>): void;
}

interface SessionBuilder {
  setNotifyAll(enable: boolean): SessionBuilder;

  setInstallation(installation: string): SessionBuilder;

  onFriendMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onGroupMessage(handler: Handler3<string, string, BasicMessageFrom>): SessionBuilder;

  onRoomMessage(handler: Handler3<string, string, BasicMessageFrom>): SessionBuilder;

  onPassengerMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onStrangerMessage(handler: Handler2<string, BasicMessageFrom>): SessionBuilder;

  onFriendOnline(handler: Handler1<string>): SessionBuilder;

  onFriendOffline(handler: Handler1<string>): SessionBuilder;

  onStrangerOnline(handler: Handler1<string>): SessionBuilder;

  onStrangerOffline(handler: Handler1<string>): SessionBuilder;

  onSystemMessage(handler: Handler1<SystemMessageFrom>): SessionBuilder;

  onYourself(handler: Handler1<YourselfMessageFrom>): SessionBuilder;

  onAck(handler: Handler2<number, number>): SessionBuilder;

  ok(callback: Callback2<Session, Context>);
}

export {
  MessageBuilder,
  MessageLauncher,
  Session,
  SessionBuilder,
};
