"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../lib/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, next) {
    const statusCode = err instanceof AppError_1.AppError ? err.statusCode : 500;
    const message = err instanceof AppError_1.AppError ? err.message : "Internal server error";
    // Log full error details
    logger_1.default.error({
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
