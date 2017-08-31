import {
  Admin,
  MessageBuilder,
  AttributeBuilder,
  CreateCommand,
  DestroyCommand,
  MemberAppendCommand,
  MemberRemoveCommand,
} from "../../api/admin";
import {Attributes} from "../../model/models";
import {CommonServiceImpl} from "../common/common";
import {AttributeBuilderImpl} from "./buildAttribute";
import {AdminMessageBuilderImpl} from "./buildMessage";
import {CreateCommandImpl} from "./cmdCreate";
import {DestroyCommandImpl} from "./cmdDestroy";
import {MemberAppendCommandImpl} from "./cmdMemberAppend";
import {MemberRemoveCommandImpl} from "./cmdMemberRemove";

function concat(first: string, ...others): string[] {
  const all: string[] = [];
  all.push(first);
  if (others && others.length > 0) {
    for (const s of others) {
      all.push(s);
    }
  }
  return all;
}

class AdminImpl extends CommonServiceImpl implements Admin {

  public say(text: string, remark?: string): MessageBuilder {
    return new AdminMessageBuilderImpl(this, text, remark);
  }

  public setAttributes(attributes: Attributes, overwrite?: boolean): AttributeBuilder {
    return new AttributeBuilderImpl(this, attributes, overwrite);
  }

  public removeMembers(first: string, ...others): MemberRemoveCommand {
    return new MemberRemoveCommandImpl(this, concat(first, others));
  }

  public appendMembers(first: string, ...others): MemberAppendCommand {
    return new MemberAppendCommandImpl(this, concat(first, others));
  }

  public create(): CreateCommand {
    return new CreateCommandImpl(this);
  }

  public destroy(): DestroyCommand {
    return new DestroyCommandImpl(this);
  }
}

export {
  AdminImpl,
};
