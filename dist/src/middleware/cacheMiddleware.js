import { getCache, setCache } from "../redis/redisClient.js";
import logger from "../logger.js";
export default function cacheMiddleware(options = {}) {
    const ttl = options.ttl ?? 60;
    const prefix = options.keyPrefix ?? "cache";
    return async (req, res, next) => {
        try {
            const key = `${prefix}:${req.method}:${req.originalUrl}`;
            const cached = await getCache(key);
            if (cached) {
                logger.debug({ key }, "Cache hit");
                return res.json(cached);
            }
            // Capture original res.json to store response
            const originalJson = res.json.bind(res);
            let bodyToCache = null;
            res.json = (body) => {
                try {
                    bodyToCache = body;
                    setCache(key, bodyToCache, ttl).catch((e) => logger.warn({ e }, "Failed to set cache"));
                }
                catch (e) {
                    logger.warn({ e }, "Error caching response");
                }
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            logger.warn({ err }, "Cache middleware error — continuing");
            next();
        }
    };
}
