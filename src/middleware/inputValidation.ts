import type { Request, Response, NextFunction } from "express";
import { sanitizeObject } from "../utils/sanitize.ts";
import logger from "../logger.ts";

// Basic input validation and sanitization middleware.
// - Sanitizes req.body, req.query, req.params
// - Prevents prototype pollution and strips suspicious keys
export default function inputValidation(req: Request, _res: Response, next: NextFunction) {
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
  } catch (err) {
    logger.warn({ err }, "inputValidation middleware error");
    // don't block request on sanitizer errors
  }
  next();
}
