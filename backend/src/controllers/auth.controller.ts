import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { authService } from '../services/auth.service';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.register(req.body);
    return res.status(httpStatus.CREATED).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    return res.status(httpStatus.OK).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    return next(error);
  }
};

export const authController = {
  register,
  login,
};
