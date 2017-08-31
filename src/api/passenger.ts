import {BasicMessageFrom} from "../model/messages";
import {Callback, Callback2, Handler1, Handler2} from "../model/models";
import {CommonService} from "./common";

interface PassengerBuilder {
  attribute(name: string, value: any): PassengerBuilder;

  onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder;

  onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder;

  onStrangerOnline(callback: Handler1<string>): PassengerBuilder;

  onStrangerOffline(callback: Handler1<string>): PassengerBuilder;

  onAck(callback: Handler2<number, number>): PassengerBuilder;

  ok(callback: Callback2<PassengerSession, PassengerContext>);
}

interface PassengerSession {

  say(text: string, remark?: string): MessageBuilder;

  close(callback?: Callback<void>);
}

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

  toUser(userid: string): PassengerMessageLauncher;
}

interface PassengerMessageLauncher {
  ok(callback?: Callback<void>): PassengerSession;
}

interface PassengerContext extends CommonService {

  current(): string;

}

export {PassengerBuilder};
export {PassengerSession};
export {MessageBuilder};
export {PassengerMessageLauncher};
export {PassengerContext};
