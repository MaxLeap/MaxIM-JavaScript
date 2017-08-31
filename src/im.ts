import {Admin, AdminImpl} from "./service/admin";
import {Login, LoginImpl} from "./service/login";
import {APIOptions} from "./model/models";
import {PassengerBuilder, PassengerBuilderImpl} from "./service/passenger";

interface MaxIMOptions {
  app: string;
  key: string;
  region?: string;
  useHttp?: boolean;
}

interface MaxIM {
  /**
   * 登录
   */
  login(): Login;

  /**
   * 访客登录
   * @param id 访客ID
   */
  passenger(id?: string): PassengerBuilder;

  /**
   * 获取管理接口
   */
  admin(): Admin;
}

class MaxIMImpl implements MaxIM {

  private _options: APIOptions;
  private _admin: Admin;

  constructor(options: MaxIMOptions) {
    if (!options || !options.app || !options.key) {
      throw new Error(`invalid options: ${JSON.stringify(options)}`);
    }

    let server: string, protocol: string = options.useHttp ? 'http://' : 'https://';
    switch ((options.region || 'cn').toLowerCase()) {
      case 'us':
        server = 'im.maxleap.com';
        break;
      case 'cn':
        server = 'im.maxleap.cn';
        break;
      case 'test':
        server = 'imuat.maxleap.cn';
        break;
      default:
        throw new Error(`invalid region ${options.region}`);
    }
    this._options = new APIOptions(`${protocol}${server}`, options.app, options.key);
    this._admin = new AdminImpl(this._options);
  }

  login(): Login {
    return new LoginImpl(this._options);
  }

  passenger(id?: string): PassengerBuilder {
    return new PassengerBuilderImpl(this._options, id);
  }

  admin(): Admin {
    return this._admin;
  }
}

if (typeof window !== 'undefined') {
  let ml = 'ML', im = 'im';
  if (typeof window[ml] === 'undefined') {
    window[ml] = {};
  }
  window[ml][im] = function (options: MaxIMOptions): MaxIM {
    return new MaxIMImpl(options)
  };
}

export = (options: MaxIMOptions): MaxIM => new MaxIMImpl(options);