import {MessageBuilder, PassengerMessageLauncher} from "../../api/passenger";
import {Media, MessageTo, PushSettings} from "../../model/messages";
import {PassengerMessageLauncherImpl} from "./launcher";
import {PassengerSessionImpl} from "./session";

class PassengerMessageBuilderImpl implements MessageBuilder {

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

  public ack(ack: number): MessageBuilder {
    this.message.ack = parseInt(`${ack}`, 0);
    return this;
  }

  public disablePush(): MessageBuilder {
    this.createPushIfNotExist().enable = false;
    return this;
  }

  public setPushSound(sound: string): MessageBuilder {
    this.createPushIfNotExist().sound = sound;
    return this;
  }

  public setPushBadge(badge: number): MessageBuilder {
    this.createPushIfNotExist().badge = badge;
    return this;
  }

  public setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
    this.createPushIfNotExist().contentAvailable = contentAvailable;
    return this;
  }

  public setPushPrefix(prefix: string): MessageBuilder {
    this.createPushIfNotExist().prefix = prefix;
    return this;
  }

  public setPushSuffix(suffix: string): MessageBuilder {
    this.createPushIfNotExist().suffix = suffix;
    return this;
  }

  public setPushTextOverwrite(text: string): MessageBuilder {
    this.createPushIfNotExist().overwrite = text;
    return this;
  }

  public asText(): MessageBuilder {
    this.message.content.media = Media.TEXT;
    return this;
  }

  public asImage(): MessageBuilder {
    this.message.content.media = Media.IMAGE;
    return this;
  }

  public asAudio(): MessageBuilder {
    this.message.content.media = Media.AUDIO;
    return this;
  }

  public asVideo(): MessageBuilder {
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
