import { createServer } from 'http';
import app from './app';
import config from './config/config';
import { initializeSocketIO } from './socket';

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocketIO(httpServer);

// Start server
httpServer.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Socket.IO server initialized`);
});

// Export io instance for use in other files
export { io };

// Handle unexpected errors
process.on('unhandledRejection', (err: Error) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => {
    process.exit(1);
  });
});
