"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Authentication middleware using JWT strategy
 */
const authenticate = (req, res, next) => {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Authentication failed'));
        }
        if (!user) {
            return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, (info === null || info === void 0 ? void 0 : info.message) || 'Invalid or expired token'));
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map