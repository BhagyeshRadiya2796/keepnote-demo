import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { IUser } from '../types/user.types';

// Define a custom Request type that includes the user property
export interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * Authentication middleware using JWT strategy
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: IUser, info: any) => {
    if (err) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed'));
    }
    
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, info?.message || 'Invalid or expired token'));
    }
    
    (req as AuthRequest).user = user;
    return next();
  })(req, res, next);
};
