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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const token_service_1 = require("./token.service");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{ user: IUser, token: string }>}
 */
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getUserByEmail(email);
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    const token = token_service_1.tokenService.generateToken(user.id);
    return { user, token };
});
/**
 * Register a new user
 * @param {Object} userData - User data to register
 * @returns {Promise<{ user: IUser, token: string }>}
 */
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_service_1.userService.getUserByEmail(userData.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    const user = yield user_service_1.userService.createUser(userData);
    const token = token_service_1.tokenService.generateToken(user.id);
    return { user, token };
});
exports.authService = {
    login,
    register,
};
//# sourceMappingURL=auth.service.js.map