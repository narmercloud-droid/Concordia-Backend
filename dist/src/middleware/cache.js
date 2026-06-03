import { createHash } from "crypto";
import { clearCache, getCache, setCache } from "../lib/redis.js";
import { trackApiCacheHit, trackApiCacheMiss } from "../metrics/metrics.js";
const generateCacheKey = (req) => {
    const hash = createHash("sha256");
    const auth = req.headers.authorization || "";
    hash.update(`${req.method}:${req.originalUrl}:${auth}`);
    return `http-cache:${hash.digest("hex")}`;
};
export const cacheGet = async (key) => {
    const cached = await getCache(key);
    return cached ? JSON.parse(cached) : null;
};
export const cacheInvalidate = async (pattern) => {
    await clearCache(pattern);
};
export const cacheRoute = (ttl = 60) => {
    return async (req, res, next) => {
        if (req.method !== "GET") {
            return next();
        }
        const cacheKey = generateCacheKey(req);
        const routeLabel = req.route?.path || req.path || req.originalUrl;
        try {
            const cachedResponse = await getCache(cacheKey);
            if (cachedResponse) {
                trackApiCacheHit(routeLabel);
                res.set("X-Cache", "HIT");
                return res.tson(JSON.parse(cachedResponse));
            }
            const originalJson = res.tson.bind(res);
            res.tson = (data) => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        setCache(cacheKey, JSON.stringify(data), ttl).catch(console.error);
                        trackApiCacheMiss(routeLabel);
                        res.set("X-Cache", "MISS");
                    }
                }
                catch (error) {
                    console.error("Cache storage error:", error);
                }
                return originalJson(data);
            };
            next();
        }
        catch (error) {
            console.error("Cache middleware error:", error);
            next();
        }
    };
};
