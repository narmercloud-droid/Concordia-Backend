import client from "../redis/redisClient.js";
import logger from "../logger.js";
const WINDOW_SECONDS = 15 * 60;
const LIMIT = 5;
const fallbackMap = new Map();
export default async function contactRateLimit(req, res, next) {
    try {
        const ip = String(req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
            req.ip ||
            req.socket.remoteAddress ||
            "unknown");
        const key = `contact:${ip}`;
        if (client && typeof client.incr === "function") {
            const current = await client.incr(key);
            if (current === 1) {
                await client.expire(key, WINDOW_SECONDS);
            }
            if (current > LIMIT) {
                res.status(429).json({ error: "Too many contact messages. Please try again later." });
                return;
            }
            next();
            return;
        }
        const now = Date.now();
        const entry = fallbackMap.get(key) || { count: 0, resetAt: now + WINDOW_SECONDS * 1000 };
        if (now > entry.resetAt) {
            entry.count = 1;
            entry.resetAt = now + WINDOW_SECONDS * 1000;
        }
        else {
            entry.count += 1;
        }
        fallbackMap.set(key, entry);
        if (entry.count > LIMIT) {
            res.status(429).json({ error: "Too many contact messages. Please try again later." });
            return;
        }
        next();
    }
    catch (err) {
        logger.warn({ err }, "Contact rate limiter error — allowing request");
        next();
    }
}
