import { Prisma } from '@prisma/client';
import { DEFAULT_INTERNAL_ERROR_MESSAGE } from '../contracts/errors.js';
import { httpStatusFromCode } from '../contracts/httpStatus.js';
export function errorMiddleware(err, req, res, _next) {
    // If it's already an ApiError-like object, return normalized envelope
    const apiErr = err;
    if (apiErr && typeof apiErr.code === 'string') {
        const status = httpStatusFromCode(apiErr.code);
        const payload = { success: false, error: apiErr };
        res.status(status).json(payload);
        return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            const payload = {
                success: false,
                error: { code: 'NOT_FOUND', message: 'Record not found' },
            };
            res.status(404).json(payload);
            return;
        }
        if (err.code === 'P2002') {
            const payload = {
                success: false,
                error: { code: 'CONFLICT', message: 'Record already exists' },
            };
            res.status(409).json(payload);
            return;
        }
    }
    // Unexpected error — log and return generic internal error
    console.error('Unexpected error in request', { err, path: req.path, method: req.method });
    const payload = {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: DEFAULT_INTERNAL_ERROR_MESSAGE },
    };
    res.status(500).json(payload);
}
export default errorMiddleware;
