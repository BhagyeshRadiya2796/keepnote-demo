import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

/**
 * Custom hook to access authentication state from Redux store
 */
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  
  return {
    user: auth.user,
    isAuthenticated: !!auth.user,
    isLoading: auth.isLoading,
    error: auth.error
  };
};
