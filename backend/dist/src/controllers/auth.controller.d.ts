import { Request, Response, NextFunction } from 'express';
export declare const authController: {
    register: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
//# sourceMappingURL=auth.controller.d.ts.map