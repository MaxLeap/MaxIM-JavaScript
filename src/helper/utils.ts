import {MessageFrom, BasicMessageFrom} from "../model/messages";
class ParrotError extends Error {
    public message: string;
    public errorCode: number;
    public errorMessage: string;

    constructor(error: {errorCode: number,errorMessage: string}) {
        super(error.errorMessage);
        this.errorCode = error.errorCode;
        this.errorMessage = error.errorMessage;
        this.message = error.errorMessage;
    }

    toJSON(): any {
        return {
            errorCode: this.errorCode,
            errorMessage: this.errorMessage
        };
    }
}

function convert2basic(origin: MessageFrom): BasicMessageFrom {
    let ret: BasicMessageFrom = {
        content: origin.content,
        ts: origin.ts
    };
    if (origin.remark != null) {
        ret.remark = origin.remark;
    }
    return ret;
}

export {
    convert2basic,
    ParrotError
}