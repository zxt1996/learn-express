import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

// 验证失败返回的错误数组是ValidationError类的对象的数组，格式如下
// {
//     target: Object; // Object that was validated.
//     property: string; // Object's property that haven't pass validation.
//     value: any; // Value that haven't pass a validation.
//     constraints?: { // Constraints that failed validation with error messages.
//         [type: string]: string;
//     };
//     children?: ValidationError[]; // Contains all nested validation errors of the property
// }
function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req, res, next) => {
        // plainToClass ->>> This method transforms a plain javascript object to instance of specific class.
        // 就是把req.body对象格式的数据转成type类型的类实例格式
        // 有时候你需要跳过一些对象中没有设置的属性，
        // 比如更新数据模型时，与创建模型不同的是你只会更新部分值，
        // 那么这时候你就需要设置skipMissingProperties为true
        validate(plainToClass(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => 
                        Object.values(error.constraints)).join(", ");
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            })
    }
}

export default validationMiddleware;