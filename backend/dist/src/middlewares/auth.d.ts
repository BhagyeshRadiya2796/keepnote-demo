import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user.types';
export interface AuthRequest extends Request {
    user?: IUser;
}
/**
 * Authentication middleware using JWT strategy
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map