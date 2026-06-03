import type { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "../redis/redisClient.ts";
import logger from "../logger.ts";

type Options = {
  ttl?: number; // seconds
  keyPrefix?: string;
};

export default function cacheMiddleware(options: Options = {}) {
  const ttl = options.ttl ?? 60;
  const prefix = options.keyPrefix ?? "cache";

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${prefix}:${req.method}:${req.originalUrl}`;
      const cached = await getCache(key);
      if (cached) {
        logger.debug({ key }, "Cache hit");
        return res.json(cached);
      }

      // Capture original res.json to store response
      const originalJson = res.json.bind(res);
      let bodyToCache: any = null;

      res.json = (body: any) => {
        try {
          bodyToCache = body;
          setCache(key, bodyToCache, ttl).catch((e) => logger.warn({ e }, "Failed to set cache"));
        } catch (e) {
          logger.warn({ e }, "Error caching response");
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      logger.warn({ err }, "Cache middleware error — continuing");
      next();
    }
  };
}
