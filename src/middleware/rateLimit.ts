import { Request, Response, NextFunction } from "express";
import { redisClient } from "../lib/redis.js";
import { trackApiRateLimitHit } from "../metrics/metrics.js";

interface RateLimitConfig {
  windowSeconds: number;
  maxGlobal: number;
  maxIP: number;
  maxBranch: number;
  burstWindowSeconds: number;
  burstMax: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowSeconds: 10 * 60,
  maxGlobal: 1000,
  maxIP: 150,
  maxBranch: 300,
  burstWindowSeconds: 10,
  burstMax: 20,
};

const getBranchId = (req: Request): string | null => {
  if (req.params?.branchId) return req.params.branchId as string;
  if (req.query?.branchId && typeof req.query.branchId === "string") return req.query.branchId;
  if (req.body?.branchId && typeof req.body.branchId === "string") return req.body.branchId;
  if ((req as any).user?.branchId) return (req as any).user.branchId;
  return null;
};

const incrementKey = async (key: string, ttlSeconds: number): Promise<number> => {
  try {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, ttlSeconds);
    }
    return current;
  } catch (error) {
    console.error("Redis rate limit error:", error);
    return 0;
  }
};

export const rateLimit = (config: Partial<RateLimitConfig> = {}) => {
  const opts = { ...DEFAULT_CONFIG, ...config };

  // Disable rate limiter in non-production environments (development, testing, load-testing)
  if (process.env.NODE_ENV !== "production") {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || "unknown").toString();
    const branchId = getBranchId(req) || "none";
    const route = req.path || req.originalUrl || "unknown";

    try {
      const [globalCount, ipCount, branchCount, burstCount] = await Promise.all([
        incrementKey(`rate:global:${ip}`, opts.windowSeconds),
        incrementKey(`rate:ip:${ip}`, opts.windowSeconds),
        incrementKey(`rate:branch:${branchId}`, opts.windowSeconds),
        incrementKey(`rate:burst:${ip}`, opts.burstWindowSeconds),
      ]);

      if (
        globalCount > opts.maxGlobal ||
        ipCount > opts.maxIP ||
        branchCount > opts.maxBranch ||
        burstCount > opts.burstMax
      ) {
        trackApiRateLimitHit(route, ip, branchId);
        return res.status(429).json({
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please slow down and try again later."
          }
        });
      }
    } catch (error) {
      console.error("Rate limiter middleware failed:", error);
    }

    next();
  };
};
