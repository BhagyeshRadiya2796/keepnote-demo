import express, { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate';
import { createUserSchema, getUserSchema } from '../validations/user.validation';
import { authenticate } from '../middlewares/auth';

const router: Router = express.Router();

// Public routes
router.post('/', validate(createUserSchema), userController.createUser);

// Protected routes
router.get('/me', authenticate as any, userController.getCurrentUser);
router.get('/:userId', authenticate as any, validate(getUserSchema), userController.getUser);

export default router;
