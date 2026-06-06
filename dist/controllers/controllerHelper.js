import { ok as apiOk, fail as apiFail, wrap as apiWrap } from "../contracts/api.js";
export function controller(handlers) {
    const wrapped = {};
    for (const [name, handler] of Object.entries(handlers)) {
        wrapped[name] = async (req, res, next) => {
            try {
                await handler(req, res, next);
            }
            catch (err) {
                next(err);
            }
        };
    }
    return wrapped;
}
export const success = (res, data, message = "Success", status = 200) => {
    return res.status(status).json(apiOk(data));
};
export const fail = (res, a, b, c) => {
    // Convert previous call styles into thrown ApiError so middleware handles it
    if (typeof b === "number" || (typeof b === "undefined" && typeof c === "number")) {
        const message = a;
        const status = typeof b === "number" ? b : c ?? 400;
        throw apiFail('INVALID_INPUT', message, { status });
    }
    if (typeof b === "string") {
        const code = a;
        const message = b;
        const status = typeof c === "number" ? c : 400;
        throw apiFail(code, message, { status });
    }
    throw apiFail('INVALID_INPUT', a);
};
// Simple value-returning helpers (non-HTTP) for code that expects plain objects
export const successPlain = (data) => ({ success: true, data });
export const failPlain = (message) => ({ success: false, message });
export { apiWrap as wrap };
