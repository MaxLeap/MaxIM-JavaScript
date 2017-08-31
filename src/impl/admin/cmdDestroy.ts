import {Admin, DestroyCommand, GroupDestroy, RoomDestroy} from "../../api/admin";
import {GroupDestroyImpl} from "./destroyGroup";
import {RoomDestroyImpl} from "./destroyRoom";

class DestroyCommandImpl implements DestroyCommand {

  private admin: Admin;

  constructor(admin: Admin) {
    this.admin = admin;
  }

  public group(groupid: string): GroupDestroy {
    return new GroupDestroyImpl(this.admin, groupid);
  }

  public room(roomid: string): RoomDestroy {
    return new RoomDestroyImpl(this.admin, roomid);
  }
}

export {
  DestroyCommandImpl,
};
