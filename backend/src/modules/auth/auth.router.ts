import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { RegisterSchema, LoginSchema } from './auth.schema';

export const authRouter = Router();

authRouter.post('/register', validate(RegisterSchema), (req, res, next) => authController.register(req, res, next));
authRouter.post('/login', validate(LoginSchema), (req, res, next) => authController.login(req, res, next));
