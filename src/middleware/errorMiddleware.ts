import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../contracts/http.js';
import { DEFAULT_INTERNAL_ERROR_MESSAGE } from '../contracts/errors.js';

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

function httpStatusFromCode(code: string): number {
  switch (code) {
    case 'NOT_FOUND':
      return 404;
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'CONFLICT':
      return 409;
    case 'INVALID_INPUT':
    case 'VALIDATION_ERROR':
      return 400;
    case 'INTERNAL_ERROR':
    default:
      return 500;
  }
}

export default errorMiddleware;
