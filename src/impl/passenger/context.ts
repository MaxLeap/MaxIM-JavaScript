import {PassengerContext} from "../../api/passenger";
import {APIOptions} from "../../model/models";
import {CommonServiceImpl} from "../common/common";

class PassengerContextImpl extends CommonServiceImpl implements PassengerContext {

  private you: string;

  constructor(options: APIOptions, you: string) {
    super(options);
    this.you = you;
  }

  public current(): string {
    return this.you;
  }

}

export {
  PassengerContextImpl,
};
