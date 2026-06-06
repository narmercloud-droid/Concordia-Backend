import type { Request, Response, NextFunction } from "express";
import client from "../redis/redisClient.ts";
import logger from "../logger.ts";

const WINDOW_SECONDS = 5 * 60; // 5 minutes
const LIMIT = 100;

// In-memory fallback when Redis unavailable
const fallbackMap = new Map<string, { count: number; resetAt: number }>();

export default async function rateLimitRedis(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
    const key = `rate:${ip}`;

    if (client && typeof client.incr === "function") {
      const current = await client.incr(key);
      if (current === 1) {
        // set TTL
        await client.expire(key, WINDOW_SECONDS);
      }
      if (current > LIMIT) {
        res.status(429).json({ error: "Too many requests" });
        return;
      }
      res.setHeader("X-RateLimit-Limit", String(LIMIT));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, LIMIT - current)));
      next();
      return;
    }

    // Fallback
    const now = Date.now();
    const entry = fallbackMap.get(key) || { count: 0, resetAt: now + WINDOW_SECONDS * 1000 };
    if (now > entry.resetAt) {
      entry.count = 1;
      entry.resetAt = now + WINDOW_SECONDS * 1000;
    } else {
      entry.count += 1;
    }
    fallbackMap.set(key, entry);
    if (entry.count > LIMIT) {
      res.status(429).json({ error: "Too many requests" });
      return;
    }
    res.setHeader("X-RateLimit-Limit", String(LIMIT));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, LIMIT - entry.count)));
    next();
  } catch (err) {
    logger.warn({ err }, "Rate limiter error — allowing request");
    next();
  }
}
