import {BasicMessageFrom} from "../model/messages";
import {Callback, Callback2, Handler1, Handler2} from "../model/models";
import {CommonService} from "./common";

interface PassengerBuilder {
  attribute(name: string, value: any): PassengerBuilder;

  onUserMessage(callback: Handler2<string, BasicMessageFrom>): PassengerBuilder;

  onSystemMessage(callback: Handler1<BasicMessageFrom>): PassengerBuilder;

  onStrangerOnline(callback: Handler1<string>): PassengerBuilder;

  onStrangerOffline(callback: Handler1<string>): PassengerBuilder;

  ok(callback: Callback2<PassengerSession, PassengerContext>);
}

interface PassengerSession {

  say(text: string, remark?: string): PassengerMessageBuilder;

  close(callback?: Callback<void>);
}

interface PassengerMessageBuilder {

  asText(): PassengerMessageBuilder;

  asImage(): PassengerMessageBuilder;

  asAudio(): PassengerMessageBuilder;

  asVideo(): PassengerMessageBuilder;

  disablePush(): PassengerMessageBuilder;

  setPushSound(sound: string): PassengerMessageBuilder;

  setPushBadge(badge: number): PassengerMessageBuilder;

  setPushContentAvailable(contentAvailable: boolean): PassengerMessageBuilder;

  setPushPrefix(prefix: string): PassengerMessageBuilder;

  setPushSuffix(suffix: string): PassengerMessageBuilder;

  setPushTextOverwrite(text: string): PassengerMessageBuilder;

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
export {PassengerMessageBuilder};
export {PassengerMessageLauncher};
export {PassengerContext};
