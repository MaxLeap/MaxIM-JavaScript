import {Admin, CreateCommand, GroupBuilder, RoomBuilder} from "../../api/admin";
import {GroupBuilderImpl} from "./buildGroup";
import {RoomBuilderImpl} from "./buildRoom";

class CreateCommandImpl implements CreateCommand {

  private admin: Admin;

  constructor(admin: Admin) {
    this.admin = admin;
  }

  public group(owner: string): GroupBuilder {
    return new GroupBuilderImpl(this.admin, owner);
  }

  public room(): RoomBuilder {
    return new RoomBuilderImpl(this.admin);
  }
}

export {
  CreateCommandImpl,
};
