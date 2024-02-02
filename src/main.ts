import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import bodyParser from "body-parser";
import connectDB from "./db/connect.db";
import cors from "cors";
import verifyToken from './middleware/auth/auth.middleware';

export const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

connectDB();
app.listen(port, () => {
  console.log(`👋 Server is running on port ${port} 😂`);
});
app.get('/debt-api/', verifyToken, (req, res) => {
  res.status(200).send('Hey, debt system! 😒');
});
app.use("/debt-api/auth", authRoutes);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
    next();
});