import * as bcrypt from 'bcrypt';
import * as express from 'express';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import { Controller } from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import userModel from './../users/user.model';
import LogInDto from './logIn.dto';
import { TokenData } from '../interfaces/tokenData.interface';
import { DataStoredInToken } from '../interfaces/dataStoredInToken';
import { User } from 'users/user.interface';
import * as jwt from 'jsonwebtoken';

class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = req.body;
        if (await this.user.findOne({ email: userData.email })) {
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            // 利用bcrypt创建hash值
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword,
            });
            user.password = "undefined";
            const tokenData = this.createToken(user);
            // 设置响应头信息
            res.setHeader('Set-Cookie',[this.createCookie(tokenData)]);
            res.send(user);
        }
    }

    private loggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = req.body;
        const user = await this.user.findOne({
            email: logInData.email
        });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = "undefined";
                const tokenData = this.createToken(user);
            res.setHeader('Set-Cookie',[this.createCookie(tokenData)]);
                res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60;
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id
        };
        return {
            expiresIn,
            // jwt.sign是异步执行操作 
            // 使用jsonwebtoken创建字符串
            // 参数 (需要加密的内容, 密钥字符串， token属性， 回调函数)
            token: jwt.sign(dataStoredInToken, secret!, { expiresIn })
        }
    }

    private createCookie(tokenData: TokenData) {
        // The HTTP Authorization request header contains the credentials to authenticate a user agent with a server
        return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
    }

    private loggingOut = (req: express.Request, res: express.Response) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        res.send(200);
    }
}

export default AuthenticationController;