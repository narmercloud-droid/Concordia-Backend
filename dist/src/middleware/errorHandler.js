import { AppError } from "../lib/AppError.js";
import logger from "../utils/logger";
export function errorHandler(err, req, res, next) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal server error";
    // Log full error details
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });
    res.status(statusCode).json({
        success: false,
        error: message
    });
}
