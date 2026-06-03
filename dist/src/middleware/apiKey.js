import logger from "../logger.js";
import { env } from "../config/env.js";
const keys = (env.API_KEYS || "").split(",").map((k) => k.trim()).filter(Boolean);
export default function requireApiKey(req, res, next) {
    const provided = String(req.headers["x-api-key"] || "");
    if (!provided) {
        logger.warn({ path: req.path, ip: req.ip }, "Missing API key");
        return res.status(401).json({ success: false, message: "Missing API key", requestId: req.id || null });
    }
    if (!keys.includes(provided)) {
        logger.warn({ path: req.path, ip: req.ip }, "Invalid API key");
        return res.status(403).json({ success: false, message: "Invalid API key", requestId: req.id || null });
    }
    next();
}
