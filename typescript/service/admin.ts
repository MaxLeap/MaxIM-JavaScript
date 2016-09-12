import {Callback, ICommonService, CommonService} from "./common";

interface MessageBuilder {
    asText(): MessageBuilder;
    asImage(): MessageBuilder;
    asAudio(): MessageBuilder;
    asVideo(): MessageBuilder;

    toAll(): MessageLanucher;
    toUser(userid: string): MessageLanucher;
    toGroup(groupid: string): MessageLanucher;
    toRoom(roomid: string): MessageLanucher;
}

interface MessageLanucher {
    ok(callback: Callback<void>): Admin;
}

interface AttributeBuilder {
    forUser(userid: string, callback: Callback<void>): Admin;
    forGroup(groupid: string, callback: Callback<void>): Admin;
    forRoom(roomid: string, callback: Callback<void>): Admin;
}

interface RoomBuilder {
    attribute(key: string, value: any): RoomBuilder;
    members(): RoomBuilder;
    ok(callback: Callback<string>): Admin;
}

interface Admin extends ICommonService {
    /**
     * 发送系统消息
     * @param text
     * @param remark
     */
    say(text: string, remark?: string): MessageBuilder;

    /**
     * 属性设置
     * @param attributes
     * @param overwrite
     */
    setAttributes(attributes: {[key: string]: any}, overwrite?: boolean): AttributeBuilder;

    /**
     * 创建聊天室
     */
    createRoom(): RoomBuilder;
    /**
     * 销毁聊天室
     * @param roomid
     * @param callback
     */
    destroyRoom(roomid: string, callback: Callback<void>): Admin;
}

export class AdminImpl extends CommonService implements Admin {

    say(text: string, remark?: string): MessageBuilder {
        return undefined;
    }

    setAttributes(attributes: {}, overwrite?: boolean): AttributeBuilder {
        return undefined;
    }

    createRoom(): RoomBuilder {
        return undefined;
    }

    destroyRoom(roomid: string, callback: Callback<void>): Admin {
        return undefined;
    }

}

