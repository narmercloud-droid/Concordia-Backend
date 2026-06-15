import { httpStatusFromCode } from './httpStatus.js';
export function ok(data) {
    return { success: true, data };
}
export function fail(code, message, details) {
    return { code, message, details };
}
export function wrap(handler) {
    return async function (req, res, next) {
        try {
            const result = await handler(req, res, next);
            if (!res.headersSent) {
                // If handler already returned a normalized ApiResponse, send it as-is
                if (result && typeof result === 'object' && 'success' in result) {
                    const r = result;
                    if (!r.success && r.error?.code) {
                        res.status(httpStatusFromCode(r.error.code)).json(r);
                    }
                    else {
                        res.json(r);
                    }
                }
                else {
                    res.json(ok(result));
                }
            }
        }
        catch (err) {
            // If handler threw an ApiError-like object, normalize and send
            const maybeApiError = err;
            if (maybeApiError && typeof maybeApiError.code === 'string') {
                const status = httpStatusFromCode(maybeApiError.code);
                if (!res.headersSent)
                    res.status(status).json({ success: false, error: maybeApiError });
                return;
            }
            next(err);
        }
    };
}
