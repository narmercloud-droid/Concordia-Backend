import pino from "pino";
import { env } from "../config/env.ts";

// Create logger with JSON format for Loki ingestion
const logger = pino({
  level: env.LOG_LEVEL,
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (obj) => {
      return {
        ...obj,
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        service: "concordia-backend"
      };
    },
  },
  // Use JSON format in production, pretty in development
  ...(env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

// Child logger factory for requests
export const createRequestLogger = (requestId: string, branchId?: string) => {
  return logger.child({
    requestId,
    branchId: branchId || "unknown",
    type: "request"
  });
};

// Error logger
export const errorLogger = logger.child({ type: "error" });

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const branchId = req.headers['x-branch-id'] || req.query.branchId || req.body?.branchId;

  req.logger = createRequestLogger(requestId, branchId);

  const start = Date.now();

  req.logger.info({
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    branchId
  }, 'Request started');

  res.on('finish', () => {
    const duration = Date.now() - start;
    req.logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      branchId
    }, 'Request completed');
  });

  next();
};

export default logger;



