import { IAuthResponse, ILoginForm, ISignupForm, IUser } from '../features/auth/types';
import { apiClient } from './client';

/**
 * Authentication API methods
 * Uses the centralized API client with environment configuration
 */

export const login = async (data: ILoginForm): Promise<IAuthResponse> => {
  return apiClient.post<IAuthResponse>('/auth/login', data);
};

export const signup = async (data: ISignupForm): Promise<IAuthResponse> => {
  return apiClient.post<IAuthResponse>('/auth/signup', data);
};

export const getCurrentUser = async (): Promise<IUser> => {
  return apiClient.get<IUser>('/users/me');
  // Token is automatically added by the API client interceptor
};

