import express, { Router } from 'express';
import { registerValidation, loginValidation } from '../middleware/auth/authvalidation.middleware';
import { login, register, user, users } from '../controller/auth/auth.controller';
import verifyToken from '../middleware/auth/auth.middleware';

const authRoutes: Router = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);
authRoutes.get("/user/:id", verifyToken, user);
authRoutes.get("/users", verifyToken, users);

export default authRoutes;