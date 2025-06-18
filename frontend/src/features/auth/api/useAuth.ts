import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, signup, getCurrentUser } from '../../../api/auth';
import { ILoginForm, ISignupForm } from '../types';
import { authKeys } from './queryKeys';
import Cookies from 'js-cookie';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token in cookies with secure settings
      Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
      // Update user data in the query cache
      queryClient.setQueryData(authKeys.user(), data.user);
      // Invalidate the user query to refetch if needed
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Store token in cookies with secure settings
      Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
      // Update user data in the query cache
      queryClient.setQueryData(authKeys.user(), data.user);
      // Invalidate the user query to refetch if needed
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    retry: false,
    enabled: !!Cookies.get('token'),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return async () => {
    try {
      // Remove token from cookies
      Cookies.remove('token');
      // Clear user data from the query cache
      queryClient.setQueryData(authKeys.user(), null);
      // Invalidate the user query
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
    }
  };
};
