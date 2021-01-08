import * as express from 'express';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import { Controller } from './interfaces/controller.interface';
import * as mongoose from 'mongoose';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app: express.Application;

    constructor(controller: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controller);
        // Since Express runs all the middleware from the first to the last, 
        // your error handlers should be at the end of your application stack. 
        this.initializeErrorHandling();
    }

    private initializeMiddleware() {
        this.app.use(this.loggerMiddleware);
        this.app.use(bodyParser.json());
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    // Middleware functions have access to the request and response objects.  
    // It can attach to any place in the request-response cycle. 
    // A third argument that middleware receives is the next function. 
    private loggerMiddleware(request: express.Request, response: express.Response, next: () => void) {
        console.log(`${request.method} ${request.path}`);
        // When called, the next middleware in the chain is executed. 
        next();
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        // 从.env文件中获取PORT
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        })
    }

    private connectToTheDatabase() {
        // 从.env文件中获取链接数据库所需信息
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;

        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
    }
}

export default App;