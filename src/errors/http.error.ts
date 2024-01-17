export default class HttpError extends Error {
    private readonly status: number;
    private readonly errorCode: string;
    private readonly details: any;

    constructor(status: number, errorCode: string, message: string, details: any = null) {
        super();
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
    }
    public getErrorCode(): string {
        return this.errorCode;
    }

    public getStatus(): number {
        return this.status;
    }

    public getMessage(): string {
        return this.message;
    }

    public getDetails(): any {
        return this.details;
    }
}
