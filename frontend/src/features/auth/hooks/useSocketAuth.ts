import { useEffect } from 'react';
import { socket } from '../../../socket';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';

/**
 * Custom hook to handle Socket.IO authentication
 * This hook will connect the socket when the user is authenticated
 * and disconnect it when the user logs out
 */
export const useSocketAuth = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // When authentication state changes
    if (isAuthenticated) {
      // Get the token from cookies
      const token = Cookies.get('token');
      
      // Update socket auth with the token
      socket.auth = { token };
      
      // Connect to socket if not already connected
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      // Disconnect socket when user logs out
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated]);

  return { socket };
};
