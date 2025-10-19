import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
    userId?: string | number;
}

export const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]; 
    const decoded = jwt.verify(header as string, JWT_SECRET as string)
    if(decoded) {
        req.userId = (decoded as any).id;
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}