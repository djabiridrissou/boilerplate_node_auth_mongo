import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userData: any;
        }
    }
}

export default (req: Request, res: Response, next: NextFunction): any => {
    try {
        const jwt = require("jsonwebtoken");
        const token: any = req.headers.authorization?.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Log in to continue"
        });
    }
};