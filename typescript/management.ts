import {UserInfo} from "./models";

export class Management {
    app: string;
    sign: string;
    you: string;
    server: string;

    constructor(server: string, app: string, sign: string, you: string) {
        this.server = server;
        this.app = app;
        this.sign = sign;
        this.you = you;
    }

    private static successful(response: Response) {
        return response.status > 199 && response.status < 300;
    }

    private _headers(): { [key: string]: string } {
        return {
            'x-ml-appid': this.app,
            'x-ml-apikey': this.sign,
            'content-type': 'application/json; charset=utf-8'
        };
    }

    userInfo(userid: string, callback: (err: Error, data?: UserInfo)=>void) {
        let url = `${this.server}/ctx/${userid}`;
        let opts = {
            headers: this._headers()
        };
        fetch(url, opts)
            .then(response => {
                if (Management.successful(response)) {
                    return response.json();
                } else {
                    throw new Error(response.status.toString());
                }
            })
            .then(result => {
                callback(null, <UserInfo>result);
            })
            .catch(e => {
                callback(e);
            });
    }

    searchUsers(size: number, skip: number, sort: string, data: any, callback: (err: Error, data: UserInfo[]) => void) {
        //TODO
    }

    setUserAttributes(userid: string, data: any, callback: (err: Error) => void) {
        //TODO
    }
}