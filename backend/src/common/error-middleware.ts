import { NextFunction, Request, Response } from "express";
import ApiError from "./api-error";
import config from "../config/config";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err.message);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Handle unexpected errors
    return res.status(config.statusCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal server error'
    });
};

export default errorHandler; 