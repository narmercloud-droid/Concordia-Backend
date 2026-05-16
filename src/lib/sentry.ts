import * as Sentry from "@sentry/node";
import { createRequire } from "module";
import { env } from "../config/env.js";

const require = createRequire(import.meta.url);
let nodeProfilingIntegration: any = undefined;
try {
  const profiling = require("@sentry/profiling-node");
  nodeProfilingIntegration = profiling.nodeProfilingIntegration;
} catch (error) {
  console.warn("Sentry profiling integration unavailable:", error.message || error);
}

// Initialize Sentry only in production and staging
if (env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: env.NODE_ENV,
    integrations: [
      // Add profiling integration if available
      ...(nodeProfilingIntegration ? [nodeProfilingIntegration()] : [])
    ],
    // Performance Monitoring
    tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 0.5, // 10% in prod, 50% in staging
    // Release Health
    enableTracing: true,
    // Set profiling sample rate
    profilesSampleRate: 1.0,
  });

  console.log("🔧 Sentry initialized for", env.NODE_ENV);
}

// Global error handler
export const setupGlobalErrorHandler = (app: any) => {
  // The error handler must be registered before any other error middleware
  const expressErrorHandler = (Sentry as any).expressErrorHandler;
  if (typeof expressErrorHandler === "function") {
    app.use(expressErrorHandler());
  }

  // Optional fallthrough error handler
  app.use(function onError(err: any, req: any, res: any, next: any) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });
};

// Capture exceptions
export const captureException = (error: Error, context?: any) => {
  if (env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext("additional_info", context);
      }
      Sentry.captureException(error);
    });
  }
};

// Capture messages
export const captureMessage = (message: string, level: Sentry.SeverityLevel = "info", context?: any) => {
  if (env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      if (context) {
        scope.setContext("additional_info", context);
      }
      Sentry.captureMessage(message);
    });
  }
};

// Add request context
export const setUser = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role
  });
};

// Add tags
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// Add extra context
export const setContext = (key: string, context: any) => {
  Sentry.setContext(key, context);
};

// Performance monitoring
export const startTransaction = (name: string, op: string) => {
  return (Sentry as any).startTransaction({
    name,
    op
  });
};

export { Sentry };