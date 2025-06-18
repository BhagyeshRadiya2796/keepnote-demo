import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
/**
 * Configure and initialize Socket.IO server
 * @param {HttpServer} httpServer - HTTP server instance
 * @returns {SocketIOServer} Socket.IO server instance
 */
export declare const initializeSocketIO: (httpServer: HttpServer) => SocketIOServer;
//# sourceMappingURL=index.d.ts.map