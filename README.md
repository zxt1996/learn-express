# learn-express
## environment variables
- dotenv：调用.env文件中的变量
- envalid：检查.env文件中的变量

## mongoose
```
// Everything in Mongoose starts with a Schema. 
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);
```
### CURD
```
const createdPost = new postModel(postData);
createdPost.save()
```
- postModel.find()
- postModel.findById(req.params.id)
- postModel.findByIdAndUpdate(id, postData, { new: true })
- postModel.findByIdAndDelete(id)