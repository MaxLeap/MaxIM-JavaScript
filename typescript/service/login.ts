import {SessionBuilder, SessionBuilderImpl} from "./session";
import {APIOptions} from "../model/models";
import {md5} from "../helper/md5";

/**
 * 登录器
 */
export interface Login {
    /**
     * 极简登录
     * @param userid 用户ID
     */
    simple(userid: string): SessionBuilder;
    /**
     * 通过MaxLeap用户账号登录
     * @param username 用户名
     * @param password 密码
     */
    byMaxleapUser(username: string, password: string): SessionBuilder;
    /**
     * 通过手机号登录
     * @param phone 手机号码
     * @param verify 验证码
     */
    byPhone(phone: string, verify: string): SessionBuilder;
}

/**
 * 登录器实现类
 */
export class LoginImpl implements Login {

    private _options: APIOptions;
    private _basicAuth: {};

    constructor(apiOptions: APIOptions) {
        this._options = apiOptions;
        let foo = new Date().getTime();
        let bar = md5(`${foo}${this._options.sign}`) + ',' + foo;
        this._basicAuth = {
            app: this._options.app,
            sign: bar
        }
    }

    private static _extend(target: {}, source: {}): void {
        for (let k in source) {
            target[k] = source[k];
        }
    }

    simple(userid: string): SessionBuilder {
        let authdata = {
            client: userid
        };
        LoginImpl._extend(authdata, this._basicAuth);
        return new SessionBuilderImpl(this._options, authdata);
    }

    byMaxleapUser(username: string, password: string): SessionBuilder {
        let authdata = {
            username: username,
            password: password
        };
        LoginImpl._extend(authdata, this._basicAuth);
        return new SessionBuilderImpl(this._options, authdata);
    }

    byPhone(phone: string, verify: string): SessionBuilder {
        let authdata = {
            phone: phone,
            password: verify
        };
        LoginImpl._extend(authdata, this._basicAuth);
        return new SessionBuilderImpl(this._options, authdata);
    }
}