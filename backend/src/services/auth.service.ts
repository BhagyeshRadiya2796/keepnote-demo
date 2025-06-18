import httpStatus from 'http-status';
import { userService } from './user.service';
import { tokenService } from './token.service';
import ApiError from '../utils/ApiError';
import { IUser } from '../types/user.types';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{ user: IUser, token: string }>}
 */
const login = async (email: string, password: string): Promise<{ user: IUser, token: string }> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  
  const token = tokenService.generateToken(user.id, { email: user.email, username: user.username });
  return { user, token };
};

/**
 * Register a new user
 * @param {Object} userData - User data to register
 * @returns {Promise<{ user: IUser, token: string }>}
 */
const register = async (userData: { email: string, password: string, username: string }): Promise<{ user: IUser, token: string }> => {
  if (await userService.getUserByEmail(userData.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  // If username is not provided, extract it from email
  if (!userData.username) {
    userData.username = userData.email.split('@')[0];
  }
  
  const user = await userService.createUser(userData);
  const token = tokenService.generateToken(user.id, { email: user.email, username: user.username });
  return { user, token };
};

export const authService = {
  login,
  register,
};
