import dotenv from "dotenv";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dotenv.config();
  process.env.NODE_ENV = process.env.NODE_ENV ?? "development";
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "staging", "test"]),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  LOG_LEVEL: z.string().default("info"),
  CORS_ORIGIN: z.string().optional(),
  REDIS_URL: z.string().url().optional(),
  API_KEYS: z.string().optional(), // comma-separated API keys
  JWT_REFRESH_SECRET: z.string().min(8).optional(),
  PAYPAL_CLIENT_ID: z.string().min(8).optional(),
  PAYPAL_CLIENT_SECRET: z.string().min(8).optional(),
  PAYPAL_MODE: z.enum(["sandbox", "live"]).default("sandbox"),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_TRACES_SAMPLE_RATE: z.preprocess(
    (value) => (value ? Number(value) : undefined),
    z.number().min(0).max(1).optional()
  ),
  GOOGLE_PLACES_API_KEY: z.string().min(8).optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

const data = parsed.data;

if (data.NODE_ENV === "production" && process.env.CASH_ONLY_LAUNCH !== "true") {
  const missing: string[] = [];
  if (!data.REDIS_URL) missing.push("REDIS_URL");
  if (!data.PAYPAL_CLIENT_ID) missing.push("PAYPAL_CLIENT_ID");
  if (!data.PAYPAL_CLIENT_SECRET) missing.push("PAYPAL_CLIENT_SECRET");
  if (missing.length) {
    console.error(`❌ Missing required production env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

export const env = data;
