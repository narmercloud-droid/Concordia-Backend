import { PrismaClient } from "@prisma/client";
import logger from "../logger.js";
import { getRequestContext } from "../context/requestContext.js";
import { env } from "../config/env.js";
let _prisma = null;
function getDatabaseUrlFallback() {
    // Use validated DATABASE_URL from env
    const raw = env.DATABASE_URL;
    // If using Postgres, add minimal connection hints for PgBouncer readiness.
    try {
        if (/postgres/i.test(raw)) {
            let modified = raw;
            if (!/connection_limit=/i.test(modified)) {
                modified = modified + (modified.includes("?") ? "&" : "?") + "connection_limit=20";
            }
            if (!/pool_timeout=/i.test(modified)) {
                modified = modified + (modified.includes("?") ? "&" : "?") + "pool_timeout=10";
            }
            return modified;
        }
    }
    catch (_e) {
        void _e;
        // ignore and return raw
    }
    return raw;
}
function ensurePrisma() {
    if (_prisma)
        return _prisma;
    const url = getDatabaseUrlFallback();
    // Construct PrismaClient with explicit datasource URL to avoid relying on generated client env during build
    _prisma = new PrismaClient({
        datasources: { db: { url } },
        log: [
            { emit: "event", level: "query" },
            { emit: "event", level: "error" },
            { emit: "event", level: "info" },
            { emit: "event", level: "warn" }
        ]
    });
    // Prisma middleware: measure duration, log slow queries and failed queries with request context
    try {
        _prisma.$use(async (params, next) => {
            const start = Date.now();
            try {
                const result = await next(params);
                const duration = Date.now() - start;
                const ctx = getRequestContext();
                if (duration > 200) {
                    (ctx?.logger || logger).warn({
                        model: params.model,
                        action: params.action,
                        durationMs: duration,
                        params: params.args,
                        requestId: ctx?.requestId
                    }, "Slow Prisma query");
                }
                return result;
            }
            catch (err) {
                const ctx = getRequestContext();
                (ctx?.logger || logger).error({
                    err,
                    model: params.model,
                    action: params.action,
                    params: params.args,
                    requestId: ctx?.requestId
                }, "Prisma query failed");
                throw err;
            }
        });
        // Query event: also log long-running raw queries (duration provided by event)
        _prisma.$on("query", (e) => {
            const ctx = getRequestContext();
            if (e.duration && e.duration > 200) {
                (ctx?.logger || logger).warn({ query: e.query, params: e.params, duration: e.duration, requestId: ctx?.requestId }, "Prisma raw query slow");
            }
        });
        _prisma.$on("error", (e) => {
            const ctx = getRequestContext();
            (ctx?.logger || logger).error({ err: e, requestId: ctx?.requestId }, "Prisma engine error");
        });
    }
    catch (e) {
        // If middleware registration fails, at least log
        logger.warn({ e }, "Prisma middleware setup failed");
    }
    // Ensure Prisma disconnects on process termination signals
    try {
        process.on("SIGTERM", async () => {
            try {
                logger.info("SIGTERM received: disconnecting Prisma");
                await _prisma.$disconnect();
            }
            catch (e) {
                logger.error({ e }, "Error during Prisma disconnect on SIGTERM");
            }
        });
        process.on("SIGINT", async () => {
            try {
                logger.info("SIGINT received: disconnecting Prisma");
                await _prisma.$disconnect();
            }
            catch (e) {
                logger.error({ e }, "Error during Prisma disconnect on SIGINT");
            }
        });
    }
    catch (e) {
        logger.warn({ e }, "Failed to register process signal handlers for Prisma");
    }
    return _prisma;
}
export const prisma = new Proxy({}, {
    get(_target, prop) {
        const client = ensurePrisma();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore forward property access
        return client[prop];
    },
    set(_target, prop, value) {
        const client = ensurePrisma();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore forward set
        client[prop] = value;
        return true;
    }
});
async function connectWithRetry(retries = 10, delay = 500) {
    const client = ensurePrisma();
    for (let i = 0; i < retries; i++) {
        try {
            await client.$connect();
            logger.info("Prisma connected");
            return;
        }
        catch (err) {
            logger.warn({ err, attempt: i }, `Prisma connection failed, retrying in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    throw new Error("Prisma failed to connect after retries");
}
export async function initPrisma() {
    // Allow build environments to opt out of DB initialization by setting SKIP_DB_INIT=true
    if (process.env.SKIP_DB_INIT === "true") {
        logger.info("SKIP_DB_INIT=true, skipping Prisma connect");
        return;
    }
    await connectWithRetry();
}
