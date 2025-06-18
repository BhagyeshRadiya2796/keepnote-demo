import { UserProfile } from '../models/user-profile.model';
import { IUser } from '../types/user.types';

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<IUser>}
 */
const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  return UserProfile.create(userData);
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<IUser | null>}
 */
const getUserById = async (id: string): Promise<IUser | null> => {
  return UserProfile.findById(id);
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<IUser | null>}
 */
const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserProfile.findOne({ email });
};

export const userService = {
  createUser,
  getUserById,
  getUserByEmail,
};
