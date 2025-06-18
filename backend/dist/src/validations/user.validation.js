"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Must be a valid email address',
            'any.required': 'Email is required',
        }),
        password: joi_1.default.string().min(6).required().label('Password'),
    }),
};
exports.getUserSchema = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().required().messages({
            'any.required': 'User ID is required',
        }),
    }),
};
//# sourceMappingURL=user.validation.js.map