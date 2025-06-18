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
exports.userService = void 0;
const user_profile_model_1 = require("../models/user-profile.model");
/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<IUser>}
 */
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return user_profile_model_1.UserProfile.create(userData);
});
/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<IUser | null>}
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_profile_model_1.UserProfile.findById(id);
});
/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<IUser | null>}
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return user_profile_model_1.UserProfile.findOne({ email });
});
exports.userService = {
    createUser,
    getUserById,
    getUserByEmail,
};
//# sourceMappingURL=user.service.js.map