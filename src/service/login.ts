import {md5} from "../helper/md5";
import {APIOptions} from "../model/models";
import {SessionBuilder, SessionBuilderImpl} from "./session";

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

  private static extend(target: {}, source: {}): void {
    for (const k in source) {
      target[k] = source[k];
    }
  }

  private options: APIOptions;
  private basicAuth: {};

  constructor(apiOptions: APIOptions) {
    this.options = apiOptions;
    const foo = new Date().getTime();
    const bar = md5(`${foo}${this.options.sign}`) + "," + foo;
    this.basicAuth = {
      app: this.options.app,
      sign: bar,
    };
  }

  public simple(userid: string): SessionBuilder {
    const authdata = {
      client: userid,
    };
    LoginImpl.extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }

  public byMaxleapUser(username: string, password: string): SessionBuilder {
    const authdata = {
      username,
      password,
    };
    LoginImpl.extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }

  public byPhone(phone: string, verify: string): SessionBuilder {
    const authdata = {
      phone,
      password: verify,
    };
    LoginImpl.extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }
}
