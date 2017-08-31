import {Login} from "./api/login";
import {AdminImpl} from "./impl/admin/admin";
import {LoginImpl} from "./impl/login/login";
import {PassengerBuilderImpl} from "./impl/passenger/passenger";
import {APIOptions} from "./model/models";
import {Admin} from "./api/admin";
import {PassengerBuilder} from "./api/passenger";

interface MaxIMOptions {
  app: string;
  key: string;
  region?: string;
  useHttp?: boolean;
}

/**
 * 主功能接口
 */
interface MaxIM {
  /**
   * 登录
   * @return {Login}
   */
  login(): Login;

  /**
   * 访客登录
   * @param id 访客ID
   */
  passenger(id?: string): PassengerBuilder;

  /**
   * 获取管理接口
   * @return {Admin}
   */
  admin(): Admin;
}

class MaxIMImpl implements MaxIM {

  private currentOptions: APIOptions;
  private currentAdmin: Admin;

  constructor(options: MaxIMOptions) {
    if (!options || !options.app || !options.key) {
      throw new Error(`invalid options: ${JSON.stringify(options)}.`);
    }
    let server: string;
    const protocol: string = options.useHttp ? "http://" : "https://";
    switch ((options.region || "cn").toLowerCase()) {
      case "us":
        server = "im.maxleap.com";
        break;
      case "cn":
        server = "im.maxleap.cn";
        break;
      case "test":
        server = "imuat.maxleap.cn";
        break;
      default:
        throw new Error(`invalid region ${options.region}.`);
    }
    this.currentOptions = new APIOptions(`${protocol}${server}`, options.app, options.key);
    this.currentAdmin = new AdminImpl(this.currentOptions);
  }

  public login(): Login {
    return new LoginImpl(this.currentOptions);
  }

  public passenger(id?: string): PassengerBuilder {
    return new PassengerBuilderImpl(this.currentOptions, id);
  }

  public admin(): Admin {
    return this.currentAdmin;
  }
}

if (typeof window !== "undefined") {
  const ml = "ML";
  const im = "im";
  if (typeof window[ml] === "undefined") {
    window[ml] = {};
  }
  window[ml][im] = (options: MaxIMOptions) => {
    return new MaxIMImpl(options);
  };
}

export = (options: MaxIMOptions): MaxIM => new MaxIMImpl(options);
