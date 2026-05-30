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
    JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    LOG_LEVEL: z.string().default("info"),
    CORS_ORIGIN: z.string(),
    REDIS_URL: z.string().url(),
    PAYPAL_CLIENT_ID: z.string().min(8, "PAYPAL_CLIENT_ID is required"),
    PAYPAL_CLIENT_SECRET: z.string().min(8, "PAYPAL_CLIENT_SECRET is required"),
    PAYPAL_MODE: z.enum(["sandbox", "live"]).default("sandbox"),
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_TRACES_SAMPLE_RATE: z.preprocess((value) => (value ? Number(value) : undefined), z.number().min(0).max(1).optional())
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid or missing environment variables:");
    console.error(parsed.error.format());
    process.exit(1);
}
export const env = parsed.data;
