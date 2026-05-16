import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import { clearCache, getCache, setCache } from "../lib/redis.js";
import { trackApiCacheHit, trackApiCacheMiss } from "../metrics/metrics.js";

const generateCacheKey = (req: Request): string => {
  const hash = createHash("sha256");
  const auth = req.headers.authorization || "";
  hash.update(`${req.method}:${req.originalUrl}:${auth}`);
  return `http-cache:${hash.digest("hex")}`;
};

export const cacheGet = async <T = any>(key: string): Promise<T | null> => {
  const cached = await getCache(key);
  return cached ? (JSON.parse(cached) as T) : null;
};

export const cacheInvalidate = async (pattern: string): Promise<void> => {
  await clearCache(pattern);
};

export const cacheRoute = (ttl: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
        return res.json(JSON.parse(cachedResponse));
      }

      const originalJson = res.json.bind(res);
      res.json = (data: any) => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            setCache(cacheKey, JSON.stringify(data), ttl).catch(console.error);
            trackApiCacheMiss(routeLabel);
            res.set("X-Cache", "MISS");
          }
        } catch (error) {
          console.error("Cache storage error:", error);
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};