import * as mongoose from 'mongoose';
import { Post } from './post.interface';

// Everything in Mongoose starts with a Schema. 
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const postSchema = new mongoose.Schema({
    // One-To-Many数据关系
    author: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
    content: String,
    title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;