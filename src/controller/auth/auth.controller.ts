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
        const { fullName, email, password, phoneNumber } = req.body;
        const verifyEmail = await userModel.findOne({ email: email });
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            });
        } else {
            const userId = uuidv4();
            const hash = await bcrypt.hash(password, 10);
            const user = new userModel({
                userId: userId,
                fullName: fullName,
                email: email,
                password: hash,
                phoneNumber: phoneNumber
            });
            const response = await user.save();
            return res.status(201).json({
                message: 'User successfully created!',
                result: response,
                success: true
            });
        }
    } catch (error: any) {
        return res.status(412).json({
            success: false,
            message: error.message
        });
    }
});

const login = asyncHandler(async (req, res): Promise<any> => {
    try {
     
        const { email, password } = req.body;
        let getUser: any;
        const user = await userModel.findOne({ email: email });
        
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
                    email: getUser.email,
                    userId: getUser.userId
                },
                //Signign the token with the JWT_SECRET in the .env
                process.env.JWT_SECRET!,
                {
                    expiresIn: "5h"
                }
            );
            return res.status(200).json({
                accessToken: jwtToken,
                userId: getUser.userId,
            });
        }
    } catch(err: any) {
        return res.status(401).json({
            messgae: err.message,
            success: false
        });
    }
});

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

export { register, login, user, users };