import * as express from 'express';
import { Post } from './post.interface';
import postModel from './post.model';
import { Controller } from '../interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePost from '../posts/post.dto';
import authMiddleware from '../middleware/auth.middleware';
import { RequestWithUser } from 'interfaces/requestWithUser.interface';

class PostsController implements Controller{
    public path = '/posts';
    // the router instance is just a middleware that you can attach to your application.
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router
            .all(`${this.path}/*`, authMiddleware)
            // Another common use of the API is when you intend to change an existing document. 
            // You can do so with the use of HTTP PATCH
            .patch(`${this.path}/:id`, validationMiddleware(CreatePost, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            .post(this.path, authMiddleware, validationMiddleware(CreatePost), this.createPost);
    }

    private createPost = async (req: RequestWithUser, res: express.Response) => {
        const postData: CreatePost = req.body;
        // not yet saved into the database, but it already has a property called _id . 
        // It is a unique id and is a combination of both a timestamp and a random string.
        const createdPost = new this.post({
            ...postData,
            author: req.user?._id
        });
        // When you run  reatedPost.save() it is saved to the collection
        const savedPost = await createdPost.save();
        res.send(savedPost);
    }

    private getAllPosts = (req: express.Request, res: express.Response) => {
        this.post.find()
            .then((posts: any) => {
                res.send(posts);
            })
    }

    private getPostById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        this.post.findById(id)
            .then((posts: any) => {
                res.send(posts);
            }).catch((error: any) => {
                // 使用中间件处理错误
                // If you pass the error to the next function, 
                // the framework omits(省略) all the other middleware in the chain 
                // and skips straight to the error handling middleware 
                // which is recognized by the fact that it has four arguments.
                next(new PostNotFoundException(error.toString()));
            })
    }

    private modifyPost = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const postData: Post = req.body;
        const id = req.params.id;
        this.post.findByIdAndUpdate(id, postData, { new: true })
            .then((posts: any) => {
                res.send(posts);
            }).catch((err: any) => {
                next(new PostNotFoundException(err.toString()));
            })
    }

    private deletePost = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const id = req.params.id;
        this.post.findByIdAndDelete(id)
            .then((successResponse: any) => {
                res.send(200);
            }).catch((err: any) => {
                next(new PostNotFoundException(err.toString()));
            })
    }
}

export default PostsController;