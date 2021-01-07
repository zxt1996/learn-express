import App from './app';
import PostsController from './posts/post.controller';
import { validateEnv } from './utils/validateEnv';

// 验证.env文件中的数据是否符合预期
validateEnv();

const app = new App(
    [
        new PostsController(),
    ]
)

app.listen();