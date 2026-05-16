import { redisClient } from "../lib/redis.js";
import { trackApiRateLimitHit } from "../metrics/metrics.js";
const DEFAULT_CONFIG = {
    windowSeconds: 10 * 60,
    maxGlobal: 1000,
    maxIP: 150,
    maxBranch: 300,
    burstWindowSeconds: 10,
    burstMax: 20,
};
const getBranchId = (req) => {
    if (req.params?.branchId)
        return req.params.branchId;
    if (req.query?.branchId && typeof req.query.branchId === "string")
        return req.query.branchId;
    if (req.body?.branchId && typeof req.body.branchId === "string")
        return req.body.branchId;
    if (req.user?.branchId)
        return req.user.branchId;
    return null;
};
const incrementKey = async (key, ttlSeconds) => {
    try {
        const current = await redisClient.incr(key);
        if (current === 1) {
            await redisClient.expire(key, ttlSeconds);
        }
        return current;
    }
    catch (error) {
        console.error("Redis rate limit error:", error);
        return 0;
    }
};
export const rateLimit = (config = {}) => {
    const opts = { ...DEFAULT_CONFIG, ...config };
    return async (req, res, next) => {
        const ip = (req.ip || req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown").toString();
        const branchId = getBranchId(req) || "none";
        const route = req.path || req.originalUrl || "unknown";
        try {
            const [globalCount, ipCount, branchCount, burstCount] = await Promise.all([
                incrementKey(`rate:global:${ip}`, opts.windowSeconds),
                incrementKey(`rate:ip:${ip}`, opts.windowSeconds),
                incrementKey(`rate:branch:${branchId}`, opts.windowSeconds),
                incrementKey(`rate:burst:${ip}`, opts.burstWindowSeconds),
            ]);
            if (globalCount > opts.maxGlobal ||
                ipCount > opts.maxIP ||
                branchCount > opts.maxBranch ||
                burstCount > opts.burstMax) {
                trackApiRateLimitHit(route, ip, branchId);
                return res.status(429).json({
                    success: false,
                    error: {
                        code: "RATE_LIMIT_EXCEEDED",
                        message: "Too many requests. Please slow down and try again later."
                    }
                });
            }
        }
        catch (error) {
            console.error("Rate limiter middleware failed:", error);
        }
        next();
    };
};
