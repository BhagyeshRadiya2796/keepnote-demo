import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { tokenService } from '../services/token.service';
import { setupNoteEvents } from './noteEvents';
import config from '../config/config';

/**
 * Configure and initialize Socket.IO server
 * @param {HttpServer} httpServer - HTTP server instance
 * @returns {SocketIOServer} Socket.IO server instance
 */
export const initializeSocketIO = (httpServer: HttpServer): SocketIOServer => {
  // Debug configuration
  console.log('Initializing Socket.IO with config:', {
    clientUrl: config.clientUrl,
    port: config.port
  });
  
  const io = new SocketIOServer(httpServer, {
    cors: {
      // Allow connections from any origin in development
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    allowEIO3: true, // Allow Engine.IO version 3 client connections
    transports: ['websocket', 'polling'] // Enable both WebSocket and polling transports
  });
  
  // Debug all connections
  io.engine.on('connection', (socket) => {
    console.log(`New raw socket connection: ${socket.id}`);
  });
  
  // Debug connection events
  io.on('connection', (socket) => {
    console.log(`Main namespace connection: ${socket.id}`);
    
    // Debug all events on the main namespace
    socket.onAny((event, ...args) => {
      console.log(`Main namespace event: ${event}`, args);
    });
  });
  
  // Debug middleware execution
  io.engine.on('headers', (headers, req) => {
    console.log('Socket.IO headers:', headers);
  });

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }
      
      // Verify the token and attach user to socket
      const decoded = tokenService.verifyToken(token);
      
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      // Attach user data to socket for use in event handlers
      socket.data.user = decoded;
      
      console.log('DEBUG - User data attached to socket:', JSON.stringify(socket.data.user));
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Setup note events
  setupNoteEvents(io);

  return io;
};
