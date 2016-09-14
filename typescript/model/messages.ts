// Define all message struct.

// Message media type:  0=text,1=image,2=audio,3=video
export enum Media{
    TEXT = 0,
    IMAGE = 1,
    AUDIO = 2,
    VIDEO = 3
}

export enum Receiver{
    ACTOR = 0,
    GROUP = 1,
    ROOM = 2,
    PASSENGER = 3,
    STRANGER = 4
}

export interface Content {
    media?: Media;
    body: string;
}

export interface MessageTo {
    to: {
        id: string;
        type?: Receiver;
    };
    content: Content;
    push?: PushSettings;
    remark?: string;
}

export interface PushSettings {
    enable?: boolean;
    sound?: string;
    prefix?: string;
    suffix?: string;
    overwrite?: string;
    badge?: number;
    contentAvailable?: boolean;
}

export interface MessageFrom {
    from: {
        id: string;
        type?: Receiver;
        gid?: string;
    },
    content: Content;
    ts: number;
    remark?: string;
}

export interface BasicMessageFrom {
    content: Content;
    ts: number;
    remark?: string;
}

export interface SystemMessageFrom {
    content: Content;
    ts: number;
    remark?: string;
}

export interface SystemMessageTo {
    push?: PushSettings;
    content: Content;
    remark?: string;
}

export interface YourselfMessageFrom {
    to: {
        id: string;
        type?: Receiver;
    };
    content: Content;
    ts: number;
    remark?: string;
}
