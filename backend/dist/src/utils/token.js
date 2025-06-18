"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const token_service_1 = require("../services/token.service");
/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token
 * @returns {any} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        return token_service_1.tokenService.verifyToken(token);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token.js.map