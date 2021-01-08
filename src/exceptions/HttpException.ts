// The error that gets thrown when the runtime error occurs inherits from Error.prototype
class HttpException extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        // The Error.prototype.constructor accept one argument, and it is the error message. 
        super(message);
        this.status = status;
        this.message = message;
    }
}

export default HttpException;