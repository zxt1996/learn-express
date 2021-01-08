import HttpException from './HttpException';

class PostNotFoundException extends HttpException {
    constructor(message: string) {
        super(404, message)
    }
}

export default PostNotFoundException;