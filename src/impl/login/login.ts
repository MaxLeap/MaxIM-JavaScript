import {Login} from "../../api/login";
import {SessionBuilder} from "../../api/session";
import {md5} from "../../helper/md5";
import {APIOptions} from "../../model/models";
import {SessionBuilderImpl} from "../session/buildSession";

function extend(target: {}, source: {}): void {
  for (const k in source) {
    if ((typeof k) === "string") {
      target[k] = source[k];
    }
  }
}

/**
 * 登录器实现类
 */
class LoginImpl implements Login {

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
    extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }

  public byMaxleapUser(username: string, password: string): SessionBuilder {
    const authdata = {
      username,
      password,
    };
    extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }

  public byPhone(phone: string, verify: string): SessionBuilder {
    const authdata = {
      phone,
      password: verify,
    };
    extend(authdata, this.basicAuth);
    return new SessionBuilderImpl(this.options, authdata);
  }
}

export {
  LoginImpl,
};
