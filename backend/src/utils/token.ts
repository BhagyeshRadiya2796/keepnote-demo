import { tokenService } from '../services/token.service';

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token
 * @returns {any} - Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
  try {
    return tokenService.verifyToken(token);
  } catch (error) {
    return null;
  }
};
