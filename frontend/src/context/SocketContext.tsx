import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket';
import { useSocketAuth } from '../features/auth/hooks/useSocketAuth';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  // Use the socket auth hook to handle authentication
  useSocketAuth();

  useEffect(() => {

    // Handle connection events
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Cleanup
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      
      // Note: We don't disconnect here as the useSocketAuth hook handles connection/disconnection
      // based on authentication state
    };
  }, []);

  const value = {
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
