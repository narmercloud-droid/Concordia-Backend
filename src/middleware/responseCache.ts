import type { Request, Response, NextFunction  } from "express";
import { redisClient } from "../lib/redis.js";
import { createHash } from "crypto";

// Cache key generation
const generateCacheKey = (req: Request): string => {
  const hash = createHash("sha256");
  hash.update(`${req.method}:${req.originalUrl}`);
  return `http-cache:${hash.digest("hex")}`;
};

// Response cache middleware for GET endpoints
export const responseCache = (cacheDurationSeconds: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip caching for authenticated requests with credentials
    if (req.headers.authorization) {
      return next();
    }

    const cacheKey = generateCacheKey(req);

    try {
      // Check cache
      const cachedResponse = await redisClient.get(cacheKey);
      if (cachedResponse) {
        res.set("X-Cache", "HIT");
        const payload = typeof cachedResponse === "string" ? cachedResponse : cachedResponse.toString();
        return res.tson(JSON.parse(payload));
      }
    } catch (error) {
      console.error("Cache retrieval error:", error);
      // Continue without cache
    }

    // Store the original send function
    const originalSend = res.tson.bind(res);

    // Override json method to cache response
    res.tson = function (data: any) {
      try {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient
            .setEx(cacheKey, cacheDurationSeconds, JSON.stringify(data))
            .catch((err) => console.error("Cache storage error:", err));
          res.set("X-Cache", "MISS");
        }
      } catch (error) {
        console.error("Cache storage error:", error);
      }

      return originalSend(data);
    };

    next();
  };
};

// Endpoint-specific cache durations
export const cacheDurations = {
  // Menu endpoints - cache for 60 seconds
  menu: 60,
  categories: 60,
  items: 60,

  // Analytics - cache for 10 seconds
  analytics: 10,
  dashboard: 5,

  // Branch info - cache for 30 seconds
  branch: 30,
  branches: 30,

  // Public endpoints - cache longer
  public: 300,
};





