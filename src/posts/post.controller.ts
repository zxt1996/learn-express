import * as express from 'express';
import { Post } from './post.interface';
import postModel from './post.model';
import { Controller } from '../interfaces/controller.interface';

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
        this.router.post(this.path, this.createPost);
        // Another common use of the API is when you intend to change an existing document. 
        // You can do so with the use of HTTP PATCH
        this.router.patch(`${this.path}/:id`, this.modifyPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    private createPost = (req: express.Request, res: express.Response) => {
        const postData: Post = req.body;
        // not yet saved into the database, but it already has a property called _id . 
        // It is a unique id and is a combination of both a timestamp and a random string.
        const createdPost = new this.post(postData);
        // When you run  reatedPost.save() it is saved to the collection
        createdPost.save()
            .then((savedPost) => {
                res.send(savedPost);
            })
    }

    private getAllPosts = (req: express.Request, res: express.Response) => {
        this.post.find()
            .then((posts: any) => {
                res.send(posts);
            })
    }

    private getPostById = (req: express.Request, res: express.Response) => {
        this.post.findById(req.params.id)
            .then((posts: any) => {
                res.send(posts);
            })
    }

    private modifyPost = (req: express.Request, res: express.Response) => {
        const postData: Post = req.body;
        const id = req.params.id;
        this.post.findByIdAndUpdate(id, postData, { new: true })
            .then((posts: any) => {
                res.send(posts);
            })
    }

    private deletePost = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        this.post.findByIdAndDelete(id)
            .then((successResponse: any) => {
                if (successResponse) {
                    res.send(200);
                } else {
                    res.send(404);
                }
            })
    }
}

export default PostsController;