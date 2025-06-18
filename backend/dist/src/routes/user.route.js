"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validate_1 = require("../middlewares/validate");
const user_validation_1 = require("../validations/user.validation");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes
router.post('/', (0, validate_1.validate)(user_validation_1.createUserSchema), user_controller_1.userController.createUser);
// Protected routes
router.get('/me', auth_1.authenticate, user_controller_1.userController.getCurrentUser);
router.get('/:userId', auth_1.authenticate, (0, validate_1.validate)(user_validation_1.getUserSchema), user_controller_1.userController.getUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map