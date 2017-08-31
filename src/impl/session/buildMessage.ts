import {MessageBuilder, MessageLauncher} from "../../api/session";
import {Media, MessageTo, PushSettings, Receiver} from "../../model/messages";
import {MessageLauncherImpl} from "./launcher";
import {SessionImpl} from "./session";

class MessageBuilderImpl implements MessageBuilder {

  public message: MessageTo;
  public session: SessionImpl;

  constructor(session: SessionImpl, text: string, remark?: string) {
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

  public toFriend(friend: string): MessageLauncher {
    this.message.to.id = friend;
    this.message.to.type = Receiver.ACTOR;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toGroup(groupid: string): MessageLauncher {
    this.message.to.id = groupid;
    this.message.to.type = Receiver.GROUP;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toRoom(roomid: string): MessageLauncher {
    this.message.to.id = roomid;
    this.message.to.type = Receiver.ROOM;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toPassenger(passengerid: string): MessageLauncher {
    this.message.to.id = passengerid;
    this.message.to.type = Receiver.PASSENGER;
    return new MessageLauncherImpl(this.session, this.message);
  }

  public toStranger(strangerid: string): MessageLauncher {
    this.message.to.id = strangerid;
    this.message.to.type = Receiver.STRANGER;
    return new MessageLauncherImpl(this.session, this.message);
  }

  private createPushIfNotExist(): PushSettings {
    if (!this.message.push) {
      this.message.push = {};
    }
    return this.message.push;
  }

}

export {
  MessageBuilderImpl,
};
