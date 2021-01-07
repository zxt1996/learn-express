import * as express from 'express';
import * as bodyParser from 'body-parser';

class App {
    public app: express.Application;
    public port: number;

    constructor(controller: any[], port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddleware();
        this.initializeControllers(controller);
    }

    private initializeMiddleware() {
        this.app.use(this.loggerMiddleware);
        this.app.use(bodyParser.json());
    }

    // Middleware functions have access to the request and response objects.  
    // It can attach to any place in the request-response cycle. 
    // A third argument that middleware receives is the next function. 
    private loggerMiddleware(request: express.Request, response: express.Response, next: () => void) {
        console.log(`${request.method} ${request.path}`);
        // When called, the next middleware in the chain is executed. 
        next();
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        })
    }
}

export default App;