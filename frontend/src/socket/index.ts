import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

// Get the API URL from environment variables or use default
// For Socket.IO we need to use the actual backend URL, not the proxy
const API_URL = 'http://localhost:5000';

// Create a socket instance
const socket: Socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  auth: {
    token: Cookies.get('token')
  }
});

// Debug socket connection events in development
if (import.meta.env.DEV) {
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    // Access namespace in a type-safe way
    console.log('Socket connected to namespace:', socket.io.opts.path);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
  
  // Debug all outgoing events
  const originalEmit = socket.emit;
  socket.emit = function(event: string, ...args: any[]) {
    console.log(`Socket emitting event: ${event}`, args);
    return originalEmit.apply(this, [event, ...args]);
  };
}

export { socket };
