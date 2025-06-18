"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocketIO = void 0;
const socket_io_1 = require("socket.io");
const token_service_1 = require("../services/token.service");
const noteEvents_1 = require("./noteEvents");
/**
 * Configure and initialize Socket.IO server
 * @param {HttpServer} httpServer - HTTP server instance
 * @returns {SocketIOServer} Socket.IO server instance
 */
const initializeSocketIO = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // Socket.IO authentication middleware
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided'));
            }
            // Verify the token and attach user to socket
            const decoded = token_service_1.tokenService.verifyToken(token);
            if (!decoded) {
                return next(new Error('Authentication error: Invalid token'));
            }
            // Attach user data to socket for use in event handlers
            socket.data.user = decoded;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    }));
    // Setup note events
    (0, noteEvents_1.setupNoteEvents)(io);
    return io;
};
exports.initializeSocketIO = initializeSocketIO;
//# sourceMappingURL=index.js.map