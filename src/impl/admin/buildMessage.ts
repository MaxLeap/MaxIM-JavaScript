import {Admin, MessageBuilder, MessageLauncher} from "../../api/admin";
import {Media, PushSettings, Receiver, SystemMessageTo} from "../../model/messages";
import {AdminMessageLauncherImpl} from "./launcher";

class AdminMessageBuilderImpl implements MessageBuilder {

  private admin: Admin;
  private receiver: {
    id?: string;
    type?: Receiver
  };
  private message: SystemMessageTo;

  constructor(admin: Admin, text: string, remark?: string) {
    this.admin = admin;
    this.message = {
      content: {
        media: Media.TEXT,
        body: text,
      },
    };
    if (remark !== undefined && remark !== null) {
      this.message.remark = remark;
    }
  }

  public disablePush(): MessageBuilder {
    this.touchPush().enable = false;
    return this;
  }

  public setPushSound(sound: string): MessageBuilder {
    this.touchPush().sound = sound;
    return this;
  }

  public setPushBadge(badge: number): MessageBuilder {
    this.touchPush().badge = badge;
    return this;
  }

  public setPushContentAvailable(contentAvailable: boolean): MessageBuilder {
    this.touchPush().contentAvailable = contentAvailable;
    return this;
  }

  public setPushPrefix(prefix: string): MessageBuilder {
    this.touchPush().prefix = prefix;
    return this;
  }

  public setPushSuffix(suffix: string): MessageBuilder {
    this.touchPush().suffix = suffix;
    return this;
  }

  public setPushTextOverwrite(text: string): MessageBuilder {
    this.touchPush().overwrite = text;
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
    return undefined;
  }

  public asVideo(): MessageBuilder {
    this.message.content.media = Media.VIDEO;
    return undefined;
  }

  public toAll(): MessageLauncher {
    this.receiver = {};
    return new AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toUser(userid: string): MessageLauncher {
    this.receiver = {
      id: userid,
      type: Receiver.ACTOR,
    };
    return new AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toGroup(groupid: string): MessageLauncher {
    this.receiver = {
      id: groupid,
      type: Receiver.GROUP,
    };
    return new AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  public toRoom(roomid: string): MessageLauncher {
    this.receiver = {
      id: roomid,
      type: Receiver.ROOM,
    };
    return new AdminMessageLauncherImpl(this.admin, this.message, this.receiver);
  }

  private touchPush(): PushSettings {
    if (!this.message.push) {
      this.message.push = {};
    }
    return this.message.push;
  }
}

export {
  AdminMessageBuilderImpl,
};
