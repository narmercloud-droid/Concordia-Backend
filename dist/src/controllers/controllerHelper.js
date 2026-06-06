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
    return res.status(status).json({
        success: true,
        message,
        data
    });
};
export const fail = (res, a, b, c) => {
    // Supports two call styles:
    // 1) fail(res, message, status?)
    // 2) fail(res, code, message, status?)
    if (typeof b === "number" || (typeof b === "undefined" && typeof c === "number")) {
        const message = a;
        const status = typeof b === "number" ? b : c ?? 400;
        return res.status(status).json({ success: false, message });
    }
    if (typeof b === "string") {
        const code = a;
        const message = b;
        const status = typeof c === "number" ? c : 400;
        return res.status(status).json({ success: false, code, message });
    }
    return res.status(400).json({ success: false, message: a });
};
// Simple value-returning helpers (non-HTTP) for code that expects plain objects
export const successPlain = (data) => ({ success: true, data });
export const failPlain = (message) => ({ success: false, message });
