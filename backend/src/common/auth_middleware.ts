import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config/config";
import ApiError from "./api-error";

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeaders = req.headers['authorization'];
        if (!authHeaders) {
            throw new ApiError(config.statusCode.UNAUTHORIZED, 'No authorization header');
        }

        const token = authHeaders.split(' ')[1];
        if (!token) {
            throw new ApiError(config.statusCode.UNAUTHORIZED, 'No token provided');
        }

        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.body.user = user;
            next();
        } catch (jwtError) {
            throw new ApiError(config.statusCode.UNAUTHORIZED, 'Invalid token');
        }
    } catch (error) {
        next(error);
    }
};

export default authenticate;