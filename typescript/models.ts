import {Content} from "./messages";
export interface UserDetail {
    sessions: number;
    ts: number;
    rooms?: string[];
    groups?: string[];
    installs?: string[];
    friends?: string[];
    attributes?: {[key: string]: any};
}

export interface UserOutline {
    id: string;
    online: boolean;
    ts: number;
    attributes?: {[key: string]: any};
}

export interface GroupInfo {
    id: string;
    owner: string;
    members: string[];
    ts: number;
    attributes?: {[key: string]: any};
}

export interface MyGroup extends GroupInfo {
    recent?: ChatRecord;
}

export interface RoomInfo {
    id: string;
    members: string[];
    ts: number;
    attributes?: {[key: string]: any};
}

export interface ChatRecord {
    speaker: string;
    content: Content;
    ts: number;
    remark?: string;
}

export interface Friend {
    id: string;
    online: boolean;
    recent?: ChatRecord;
}

export interface Friendship {
    from: string;
    to: string;
    ts: number;
}

export interface Passenger {
    [key: string]: any;
}

export interface LoginToken {
    appId: string;
    clientId: string;
    userId?: string;
    username?: string;
    password?: string;
    phone?: string;
    oauth?: any;
    passenger?: any;
    installId?: string;
}

