import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../contracts/http.js';
import { DEFAULT_INTERNAL_ERROR_MESSAGE } from '../contracts/errors.js';
import { httpStatusFromCode } from '../contracts/httpStatus.js';

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  // If it's already an ApiError-like object, return normalized envelope
  const apiErr = err as ApiError;
  if (apiErr && typeof apiErr.code === 'string') {
    const status = httpStatusFromCode(apiErr.code);
    const payload: ApiResponse = { success: false, error: apiErr };
    res.status(status).json(payload);
    return;
  }

  // Unexpected error — log and return generic internal error
  console.error('Unexpected error in request', { err, path: req.path, method: req.method });
  const payload: ApiResponse = {
    success: false,
    error: { code: 'INTERNAL_ERROR', message: DEFAULT_INTERNAL_ERROR_MESSAGE },
  };
  res.status(500).json(payload);
}

export default errorMiddleware;
