import express, { Router } from 'express';
import { registerValidation, loginValidation, updateUserValidation } from '../middleware/auth/authvalidation.middleware';
import { login, register, updateUser, user, users } from '../controller/auth/auth.controller';
import verifyToken from '../middleware/auth/auth.middleware';

const authRoutes: Router = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);
authRoutes.put("/update-user/:userId", updateUserValidation, updateUser);
authRoutes.get("/user/:id", verifyToken, user);
authRoutes.get("/users", verifyToken, users);

export default authRoutes;