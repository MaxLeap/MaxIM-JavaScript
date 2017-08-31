import {PassengerMessageBuilder, PassengerMessageLauncher} from "../../api/passenger";
import {Media, MessageTo, PushSettings} from "../../model/messages";
import {PassengerMessageLauncherImpl} from "./launcher";
import {PassengerSessionImpl} from "./session";

class PassengerMessageBuilderImpl implements PassengerMessageBuilder {

  public message: MessageTo;
  public session: PassengerSessionImpl;

  constructor(session: PassengerSessionImpl, text: string, remark?: string) {
    this.session = session;
    this.message = {
      to: {
        id: null,
      },
      content: {
        media: Media.TEXT,
        body: text,
      },
    };
    if (remark != null) {
      this.message.remark = remark;
    }
  }

  public disablePush(): PassengerMessageBuilder {
    this.createPushIfNotExist().enable = false;
    return this;
  }

  public setPushSound(sound: string): PassengerMessageBuilder {
    this.createPushIfNotExist().sound = sound;
    return this;
  }

  public setPushBadge(badge: number): PassengerMessageBuilder {
    this.createPushIfNotExist().badge = badge;
    return this;
  }

  public setPushContentAvailable(contentAvailable: boolean): PassengerMessageBuilder {
    this.createPushIfNotExist().contentAvailable = contentAvailable;
    return this;
  }

  public setPushPrefix(prefix: string): PassengerMessageBuilder {
    this.createPushIfNotExist().prefix = prefix;
    return this;
  }

  public setPushSuffix(suffix: string): PassengerMessageBuilder {
    this.createPushIfNotExist().suffix = suffix;
    return this;
  }

  public setPushTextOverwrite(text: string): PassengerMessageBuilder {
    this.createPushIfNotExist().overwrite = text;
    return this;
  }

  public asText(): PassengerMessageBuilder {
    this.message.content.media = Media.TEXT;
    return this;
  }

  public asImage(): PassengerMessageBuilder {
    this.message.content.media = Media.IMAGE;
    return this;
  }

  public asAudio(): PassengerMessageBuilder {
    this.message.content.media = Media.AUDIO;
    return this;
  }

  public asVideo(): PassengerMessageBuilder {
    this.message.content.media = Media.VIDEO;
    return this;
  }

  public toUser(userid: string): PassengerMessageLauncher {
    this.message.to.id = userid;
    return new PassengerMessageLauncherImpl(this.session, this.message);
  }

  private createPushIfNotExist(): PushSettings {
    if (!this.message.push) {
      this.message.push = {};
    }
    return this.message.push;
  }

}

export {
  PassengerMessageBuilderImpl,
};
