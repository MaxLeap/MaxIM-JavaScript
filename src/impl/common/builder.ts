import {APIOptions} from "../../model/models";

class Builder<T> {
  public apiOptions: APIOptions;
  public extOptions: T;

  constructor(apiOptions: APIOptions, extOptions?: T) {
    this.apiOptions = apiOptions;
    this.extOptions = extOptions;
  }
}

export {
  Builder,
};
