import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from './http.js';
import { httpStatusFromCode } from './httpStatus.js';

export function ok<T = any>(data?: T): ApiResponse<T> {
  return { success: true, data };
}

export function fail(code: string, message: string, details?: any): ApiError {
  return { code, message, details };
}

export function wrap(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<any> | any
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const result = await handler(req, res, next);
      if (!res.headersSent) {
        // If handler already returned a normalized ApiResponse, send it as-is
        if (result && typeof result === 'object' && 'success' in result) {
          const r = result as ApiResponse;
          if (!r.success && r.error?.code) {
            res.status(httpStatusFromCode(r.error.code)).json(r);
          } else {
            res.json(r);
          }
        } else {
          res.json(ok(result));
        }
      }
    } catch (err) {
      // If handler threw an ApiError-like object, normalize and send
      const maybeApiError = err as ApiError;
      if (maybeApiError && typeof maybeApiError.code === 'string') {
        const status = httpStatusFromCode(maybeApiError.code);
        if (!res.headersSent) res.status(status).json({ success: false, error: maybeApiError });
        return;
      }
      next(err);
    }
  };
}
