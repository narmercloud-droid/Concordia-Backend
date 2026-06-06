import type { Request, Response, NextFunction } from "express";
import logger from "../logger.ts";
import { env } from "../config/env.ts";

const keys = (env.API_KEYS || "").split(",").map((k) => k.trim()).filter(Boolean);

export default function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const provided = String(req.headers["x-api-key"] || "");
  if (!provided) {
    logger.warn({ path: req.path, ip: req.ip }, "Missing API key");
    return res.status(401).json({ success: false, message: "Missing API key", requestId: (req as any).id || null });
  }

  if (!keys.includes(provided)) {
    logger.warn({ path: req.path, ip: req.ip }, "Invalid API key");
    return res.status(403).json({ success: false, message: "Invalid API key", requestId: (req as any).id || null });
  }

  next();
}
