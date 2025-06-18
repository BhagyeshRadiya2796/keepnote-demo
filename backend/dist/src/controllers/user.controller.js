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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("../services/user.service");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userService.getUserById(req.params.userId);
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        return res.status(http_status_1.default.OK).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    catch (error) {
        return next(error);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userService.createUser(req.body);
        return res.status(http_status_1.default.CREATED).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    catch (error) {
        return next(error);
    }
});
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Not authenticated' });
        }
        return res.status(http_status_1.default.OK).json({
            id: authReq.user.id,
            email: authReq.user.email,
            createdAt: authReq.user.createdAt,
            updatedAt: authReq.user.updatedAt
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.userController = {
    getUser,
    createUser,
    getCurrentUser,
};
//# sourceMappingURL=user.controller.js.map