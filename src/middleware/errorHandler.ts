import type { Request, Response, NextFunction } from "express";
import logger from "../logger.ts";
import { env } from "../config/env.ts";

export default function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const reqId = (req as any).id || req.headers["x-request-id"] || null;
  const log = (req as any).log || logger;

  // Log full error with context (stack only in non-production)
  log.error({ err, reqId }, "Unhandled error");

  // Prisma-specific logging (best-effort)
  try {
    if (err && (err.name?.includes("Prisma") || err.code)) {
      log.error({ prisma: err }, "Prisma error");
    }
  } catch (e) {
    log.error({ e }, "Error while logging prisma error");
  }

  const status = err?.status || err?.statusCode || 500;
  let message = err?.message || "Error";

  if (status === 500) {
    message = "Internal Server Error";
  }

  // Do not leak stack traces in production responses
  const payload: any = {
    success: false,
    message,
    requestId: reqId
  };

  if (env.NODE_ENV !== "production" && err?.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}






