import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { userService } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth';

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.status(httpStatus.OK).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(httpStatus.CREATED).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    
    return res.status(httpStatus.OK).json({
      id: authReq.user.id,
      email: authReq.user.email,
      createdAt: authReq.user.createdAt,
      updatedAt: authReq.user.updatedAt
    });
  } catch (error) {
    return next(error);
  }
};

export const userController = {
  getUser,
  createUser,
  getCurrentUser,
};
