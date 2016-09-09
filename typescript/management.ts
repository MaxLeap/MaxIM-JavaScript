import {UserDetail} from "./models";

interface IManagement {
    //basic
    userInfo(userid: string, callback: (err: Error, data?: UserDetail) => void);
    searchUsers(size: number, skip: number, sort: string, data: any, callback: (err: Error, data: UserDetail[]) => void);
    // attributes
    setUserAttributes(userid: string, data: any, callback: (err: Error) => void);
    coverSetUserAttributes(userid: string, data: any, callback: (err: Error) => void);
    getUserAttributes(userid: string, callback: (err: Error, attributes: any) => void);
    getUserOneAttribute(userid: string, attrbuteName: string, callback: (err: Error, value: any)=>void);
    rmUserAttributes(userid: string, callback: (err: Error) => void);
}

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

    userInfo(userid: string, callback: (err: Error, data?: UserDetail) => void) {
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
                callback(null, <UserDetail>result);
            })
            .catch(e => {
                callback(e);
            });
    }
}