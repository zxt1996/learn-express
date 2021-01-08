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

### Express Error handling middleware
```
errorHandler(err, req, res, next)
```  

> 错误处理的中间件的差别主要是第一个参数是错误信息，同时要在其他 app.use() 和路由调用之后，最后定义错误处理中间件。
> 如果将任何项传递到 next() 函数（除了字符串 'route'），那么 Express 会将当前请求视为处于错误状态，并跳过所有剩余的非错误处理路由和中间件函数。