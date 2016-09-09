export interface UserInfo {
    sessions: number;
    ts: number;
    attributes: any;
    rooms: string[];
    groups: string[];
    installs: string[];
    friends: string[];
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

