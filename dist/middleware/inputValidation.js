import { sanitizeObject } from "../utils/sanitize.js";
import logger from "../logger.js";
// Basic input validation and sanitization middleware.
// - Sanitizes req.body, req.query, req.params
// - Prevents prototype pollution and strips suspicious keys
export default function inputValidation(req, res, next) {
    try {
        if (req.body && typeof req.body === "object") {
            req.body = sanitizeObject(req.body);
        }
        if (req.query && typeof req.query === "object") {
            req.query = sanitizeObject(req.query);
        }
        if (req.params && typeof req.params === "object") {
            req.params = sanitizeObject(req.params);
        }
    }
    catch (err) {
        logger.warn({ err }, "inputValidation middleware error");
        // don't block request on sanitizer errors
    }
    next();
}
