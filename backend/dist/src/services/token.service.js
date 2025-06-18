"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../config/config"));
/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes.endsWith('d')
            ? parseInt(config_1.default.jwt.accessExpirationMinutes.replace('d', ''), 10)
            : parseInt(config_1.default.jwt.accessExpirationMinutes, 10), config_1.default.jwt.accessExpirationMinutes.endsWith('d') ? 'days' : 'minutes').unix(),
    };
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret);
};
/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
};
exports.tokenService = {
    generateToken,
    verifyToken,
};
//# sourceMappingURL=token.service.js.map