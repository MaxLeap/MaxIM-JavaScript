import Axios from "axios";
import {AttachmentBuilder} from "../../api/common";
import {APIOptions, Callback} from "../../model/models";

class AttachmentBuilderImpl implements AttachmentBuilder {

  private apiOptions: APIOptions;
  private attachment: File | Blob;

  constructor(apiOptions: APIOptions, attachment: File | Blob) {
    this.apiOptions = apiOptions;
    this.attachment = attachment;
  }

  public ok(callback?: Callback<string[]>): void {
    const data: FormData = new FormData();
    data.append("attachment", this.attachment);
    const url = `${this.apiOptions.server}/attachment`;
    const header: { [key: string]: string } = {};
    for (const k in this.apiOptions.headers) {
      if (k.toLowerCase() !== "content-type") {
        header[k] = this.apiOptions.headers[k];
      }
    }
    Axios.post(url, data, {headers: header})
        .then((response) => {
          return response.data as string[];
        })
        .then((result) => {
          if (callback) {
            callback(null, result);
          }
        })
        .catch((e) => {
          if (callback) {
            callback(e);
          }
        });
  }
}

export {
  AttachmentBuilderImpl,
};
