"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const socket_1 = require("./socket");
// Create HTTP server
const httpServer = (0, http_1.createServer)(app_1.default);
// Initialize Socket.IO
const io = (0, socket_1.initializeSocketIO)(httpServer);
exports.io = io;
// Start server
httpServer.listen(config_1.default.port, () => {
    console.log(`Server is running on port ${config_1.default.port}`);
    console.log(`Socket.IO server initialized`);
});
// Handle unexpected errors
process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    httpServer.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map