import {SessionBuilder} from "./session";

/**
 * 登录器
 */
interface Login {
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

export {
  Login,
};
