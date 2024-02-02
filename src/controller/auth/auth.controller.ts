import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../../models/user/user.model';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from "express";
require('dotenv').config();

const register = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const { userDto } = req.body;
        const { fullName, identifier, password, passwordToChange, role } = userDto;
        const verifyEmail = await userModel.findOne({ identifier: identifier });
        if (verifyEmail) {
            return res.status(403).json({
                message: "Identifier already used"
            });
        } else {
            const userId = uuidv4();
            const hash = await bcrypt.hash(password, 10);
            const user = new userModel({
                userId: userId,
                fullName: fullName,
                identifier: identifier,
                password: hash,
                passwordToChange: passwordToChange,
                role: role,
                connected: false
            });
            const response = await user.save();
            return res.status(201).json({
                message: 'User successfully created!',
                data: response,
                success: true
            });
        }
    } catch (error: any) {
        return res.status(412).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

const login = asyncHandler(async (req, res): Promise<any> => {
    try {

        const { userDto } = req.body;
        const { identifier, password } = userDto;

        let getUser: any;
        const user = await userModel.findOne({ identifier: identifier });

        if (!user) {
            return res.status(401).json({
                message: "No user found with those credentials",
            })

        };
        getUser = user;
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({
                message: "Password is incorrect"
            })
        } else {
            let jwtToken = jwt.sign(
                {
                    identifier: getUser.identifier,
                    userId: getUser.userId
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "5h"
                }
            );
            user.connected = true;
            await user.save();
            return res.status(200).json({
                data: user,
                message: "Connection successful",
                token: jwtToken,
            });
        }
    } catch (err: any) {
        return res.status(401).json({
            messgae: err.message,
            success: false
        });
    }
});

const updateUser = (asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.params.userId;
        const { userDto } = req.body;
        const { fullName, identifier, password, passwordToChange, role } = userDto;

        const user = await userModel.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        user.fullName = fullName;
        user.identifier = identifier;

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            user.password = hash;
        }

        user.passwordToChange = passwordToChange;
        user.role = role;

        const updatedUser = await user.save();

        return res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
            success: true
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
}));


const user = asyncHandler(async (req, res, next): Promise<any> => {
    const { id } = req.params;
    try {
        const verifyUser = await userModel.findOne({ userId: id })
        if (!verifyUser) {
            return res.status(403).json({
                message: "user not found",
                success: false,
            })
        } else {
            return res.status(200).json({
                messgae: `user ${verifyUser.fullName}`,
                success: true
            })
        }
    }
    catch (error: any) {
        return res.status(401).json({
            sucess: false,
            message: error.message,
        })
    }
});


const users = asyncHandler(async (req, res): Promise<any> => {
    try {
        const users = await userModel.find();
        console.log(users)
        return res.status(200).json({
            data: users,
            sucess: true,
            message: "users list"
        })
    } catch (error: any) {
        return res.status(401).json({
            sucess: false,
            message: error.message,
        })
    }
});

export { register, login, updateUser, user, users };