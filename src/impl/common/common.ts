import {AttachmentBuilder, CommonService, GetAttributesBuilder, LoadBuilder, SearchBuilder} from "../../api/common";
import {APIOptions} from "../../model/models";
import {AttachmentBuilderImpl} from "./buildAttachment";
import {GetAttributesBuilderImpl} from "./buildGetAttribute";
import {LoadBuilderImpl} from "./buildLoad";
import {SearchBuilderImpl} from "./buildSearch";

class CommonServiceImpl implements CommonService {

  private opts: APIOptions;

  constructor(apiOptions: APIOptions) {
    this.opts = apiOptions;
  }

  public options(): APIOptions {
    return this.opts;
  }

  public search(query?: {}, skip?: number, limit?: number, sort?: string[]): SearchBuilder {
    return new SearchBuilderImpl(this.opts, {
      limit,
      skip,
      query,
      sort,
    });
  }

  public load(id: string): LoadBuilder {
    return new LoadBuilderImpl(this.opts, {
      id,
    });
  }

  public getAttributes(id: string, attributeName?: string): GetAttributesBuilder {
    return new GetAttributesBuilderImpl(this, id, attributeName);
  }

  public attachment(attachment: File): AttachmentBuilder {
    return new AttachmentBuilderImpl(this.opts, attachment);
  }
}

export {
  CommonServiceImpl,
};
