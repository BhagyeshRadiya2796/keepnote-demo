import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
type ValidationSchema = {
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    body?: Joi.ObjectSchema;
};
export declare const validate: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=validate.d.ts.map