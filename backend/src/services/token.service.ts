import jwt from 'jsonwebtoken';
import moment from 'moment';
import { IUser } from '../types/user.types';
import config from '../config/config';

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {Object} userData - Additional user data to include in token
 * @returns {string} - JWT token
 */
const generateToken = (userId: string, userData?: { email?: string; username?: string }): string => {
  const payload = {
    sub: userId,
    email: userData?.email,
    username: userData?.username,
    iat: moment().unix(),
    exp: moment().add(
      config.jwt.accessExpirationMinutes.endsWith('d')
        ? parseInt(config.jwt.accessExpirationMinutes.replace('d', ''), 10)
        : parseInt(config.jwt.accessExpirationMinutes, 10),
      config.jwt.accessExpirationMinutes.endsWith('d') ? 'days' : 'minutes'
    ).unix(),
  };
  console.log('DEBUG - Token payload:', JSON.stringify(payload));
  return jwt.sign(payload, config.jwt.secret);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token: string): any => {
  const decoded = jwt.verify(token, config.jwt.secret);
  console.log('DEBUG - Decoded token:', JSON.stringify(decoded));
  return decoded;
};

export const tokenService = {
  generateToken,
  verifyToken,
};
