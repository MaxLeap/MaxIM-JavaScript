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

export {
    ParrotError
}