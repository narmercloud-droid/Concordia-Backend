import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError";
import logger from "../utils/logger";

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
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
