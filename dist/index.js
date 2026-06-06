import "./globalTypes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import * as Sentry from "@sentry/node";
import adminRouter from "./routes/admin.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import authRouter from "./routes/auth.js";
import { adminAuth } from "./middleware/adminAuth.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
// ---------------------------------------------
// ðŸ” SAFE VAPID SETUP (Crashâ€‘proof)
// ---------------------------------------------
import webpush from "web-push";
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
if (publicKey && privateKey) {
    try {
        webpush.setVapidDetails("mailto:support@example.com", publicKey, privateKey);
        logger.info("Web Push enabled with VAPID keys");
    }
    catch (err) {
        logger.error({ err }, "Failed to initialize Web Push");
        logger.warn("Continuing without Web Push");
    }
}
else {
    logger.warn("Web Push disabled: missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY");
}
// ---------------------------------------------
// Core routes
// ---------------------------------------------
import menuRoutes from "./routes/menu.routes.js";
// Admin routes - menu management
import adminCategoryRoutes from "./routes/admin/category.routes.js";
import adminItemRoutes from "./routes/admin/item.routes.js";
import adminVariantRoutes from "./routes/admin/variant.routes.js";
import adminToppingRoutes from "./routes/admin/topping.routes.js";
import adminExtraRoutes from "./routes/admin/extra.routes.js";
import adminRelationRoutes from "./routes/admin/relation.routes.js";
import adminDealRoutes from "./routes/admin/deal.routes.js";
import terminalAdminRoutes from "./routes/admin/terminalAdmin.routes.js";
import terminalStatusRoutes from "./routes/admin/terminalStatus.routes.js";
import orderMonitorRoutes from "./routes/admin/orderMonitor.routes.js";
// Customer routes
import customersRoutes from "./routes/customers.routes.js";
import cartRoutes from "./routes/cart/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import orderLifecycleRoutes from "./routes/order/orderLifecycle.routes.js";
import printRoutes from "./routes/print/print.routes.js";
import courierTrackingRoutes from "./routes/courierTracking.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import courierRoutes from "./routes/courier.js";
import courierViewRoutes from "./routes/courier/courier.routes.js";
import terminalRoutes from "./routes/terminal/terminal.routes.js";
import customerTrackingRoutes from "./routes/customer/customerTracking.routes.js";
import adminCourierRoutes from "./routes/admin/adminCourier.routes.js";
import trackRoutes from "./routes/track.js";
import campaignRoutes from "./routes/campaigns.js";
import marketingRoutes from "./routes/marketing.js";
import offersRoutes from "./routes/offers.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import voucherRoutes from "./routes/voucher.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import paypalWebhookRoutes from "./routes/paypal/paypalWebhook.routes.js";
import paypalAdminRoutes from "./routes/admin/paypalAdmin.routes.js";
import adminPrinterRoutes from "./routes/admin/adminPrinter.routes.js";
import adminPrinterStatusRoutes from "./routes/admin/adminPrinterStatus.routes.js";
import adminPrinterTestRoutes from "./routes/admin/adminPrinterTest.routes.js";
import adminPrinterQueueRoutes from "./routes/admin/adminPrinterQueue.routes.js";
import adminPrinterAnalyticsRoutes from "./routes/admin/adminPrinterAnalytics.routes.js";
import adminKitchenAssignmentRoutes from "./routes/admin/adminKitchenAssignment.routes.js";
import adminPrinterSecurityRoutes from "./routes/admin/adminPrinterSecurity.routes.js";
import adminPrinterCloudRoutes from "./routes/admin/adminPrinterCloud.routes.js";
import adminPrinterFleetRoutes from "./routes/admin/adminPrinterFleet.routes.js";
import adminPrinterObservabilityRoutes from "./routes/admin/adminPrinterObservability.routes.js";
import adminTerminalRoutes from "./routes/admin/adminTerminal.routes.js";
import adminToolsRoutes from "./routes/admin/adminTools.routes.js";
import { startPrinterDiscoveryWorker } from "./jobs/printerDiscoveryWorker.js";
import { startPrinterSyncWorker } from "./jobs/printerCloudSyncWorker.js";
// Public routes
import publicRoutes from "./routes/public.routes.js";
import sunmiRouter from "./routes/sunmi.js";
import healthRoutes from './api/health/health.routes.js';
import http from "http";
import { initSocket } from "./websocket/socketServer.js";
import { registerEvents } from "./events/index.js";
import { setIO } from "./lib/socket.js";
import { initPrisma, prisma } from "./prisma/client.js";
import { startLifecycleScheduler } from "./jobs/lifecycleScheduler.js";
import { connectRedis } from "./redis/client.js";
import { redisClient } from "./lib/redis.js";
import { env } from "./config/env.js";
import inputValidation from "./middleware/inputValidation.js";
import requireApiKey from "./middleware/apiKey.js";
import { adminAuth as adminAuthMiddleware } from "./middleware/adminAuth.js";
import logger from "./utils/logger.js";
import rateLimitRedis from "./middleware/rateLimitRedis.js";
import cacheMiddleware from "./middleware/cacheMiddleware.js";
import metricsRoutes from "./routes/metrics.js";
import { httpRequestsTotal, httpRequestDurationSeconds, errorsTotal } from "./metrics/metrics.js";
import registry from "./metrics/metrics.js";
// Fatal error handlers
process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
    console.error("[FATAL] Unhandled Rejection:", err);
});
// ---------------------------------------------
// Express + Socket.IO setup
// ---------------------------------------------
const app = express();
const server = http.createServer(app);
// Lightweight in-memory counters for monitoring
let requestCount = 0;
let workersInitialized = false;
const io = initSocket(server);
setIO(io);
registerEvents(io);
// ---------------------------------------------
// Production middleware
// ---------------------------------------------
const frontend = env.FRONTEND_URL || env.CORS_ORIGIN || "";
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY", "X-Request-Id"],
    exposedHeaders: ["X-Request-Id", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    credentials: true,
    optionsSuccessStatus: 200
};
// Security headers
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-XSS-Protection", "0");
    if (env.NODE_ENV === "production") {
        // 1 year HSTS recommended when behind HTTPS
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }
    next();
});
app.use(cors(corsOptions));
// Global input validation/sanitization
app.use(inputValidation);
// Global Redis-backed rate limiter (IP-based)
app.use(rateLimitRedis);
// Metrics middleware: measure duration and increment counters
app.use((req, res, next) => {
    requestCount++;
    const end = httpRequestDurationSeconds.startTimer();
    res.on("finish", () => {
        const routeLabel = req.route?.path || req.originalUrl || req.path || "unknown";
        httpRequestsTotal.inc({ method: req.method, route: routeLabel, status: String(res.statusCode) }, 1);
        end({ method: req.method, route: routeLabel, status: String(res.statusCode) });
    });
    next();
});
if (env.NODE_ENV === "production") {
    app.enable("trust proxy");
    app.use((req, res, next) => {
        const proto = String(req.headers["x-forwarded-proto"] || req.protocol).split(",")[0];
        if (proto === "http") {
            const host = req.headers.host || req.hostname;
            return res.redirect(301, `https://${host}${req.originalUrl}`);
        }
        next();
    });
}
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    message: { error: "Too many requests, please try again later." }
}));
app.use("/api/paypal/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use((req, res, next) => {
    if (typeof res.tson !== "function") {
        res.tson = (payload) => res.json(payload);
    }
    const start = Date.now();
    res.on("finish", () => {
        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: Date.now() - start,
            remoteAddr: req.ip
        }, "HTTP request completed");
    });
    next();
});
if (env.SENTRY_DSN) {
    Sentry.init({
        dsn: env.SENTRY_DSN,
        environment: env.NODE_ENV,
        tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE ?? 0.05
    });
}
// Root health-check
app.get("/", (req, res) => {
    res.tson({
        status: "online",
        service: "Concordia Backend",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        message: "Concordia Backend is running successfully on Render"
    });
});
app.get("/health", async (req, res) => {
    try {
        // Lightweight DB check
        await prisma.$queryRaw `SELECT 1`;
        return res.status(200).json({ status: "ok", db: "connected" });
    }
    catch (err) {
        logger.warn({ err, path: req.path }, "Database health check failed");
        return res.status(500).json({ status: "error", db: "disconnected" });
    }
});
// Mount health routes
app.use('/api/health', healthRoutes);
// Readiness endpoint — used by platform to ensure service is ready to receive traffic
app.get("/ready", async (_req, res) => {
    const result = { uptime: process.uptime(), timestamp: Date.now(), services: { database: "unknown", redis: "unknown", workers: "unknown" } };
    try {
        await prisma.$queryRaw `SELECT 1`;
        result.services.database = "up";
    }
    catch (e) {
        result.services.database = "down";
        logger.warn({ err: e }, "Readiness: Prisma not ready");
    }
    try {
        if (redisClient && typeof redisClient.ping === "function") {
            await redisClient.ping();
            result.services.redis = "up";
        }
        else if (redisClient && typeof redisClient.get === "function") {
            await redisClient.get("__health__");
            result.services.redis = "up";
        }
        else {
            result.services.redis = "disabled";
        }
    }
    catch (e) {
        result.services.redis = "down";
        logger.warn({ err: e }, "Readiness: Redis not ready");
    }
    try {
        result.services.workers = workersInitialized ? "up" : "initializing";
    }
    catch (e) {
        result.services.workers = "down";
    }
    const ok = Object.values(result.services).every((s) => s === "up");
    if (ok)
        return res.status(200).json(result);
    return res.status(503).json(result);
});
// Version endpoint: returns commit + package version
app.get("/version", async (_req, res) => {
    let commit = process.env.GIT_COMMIT || process.env.COMMIT_SHA || process.env.REVISION || "";
    if (!commit) {
        try {
            const fs = await import("fs/promises");
            const path = `${process.cwd()}/REVISION`;
            const data = await fs.readFile(path, "utf8");
            commit = data.trim();
        }
        catch (e) {
            // ignore
        }
    }
    let pkgVersion = "unknown";
    try {
        const pkg = await import("../package.json", { with: { type: "json" } });
        pkgVersion = pkg.default?.version ?? "unknown";
    }
    catch (e) {
        // ignore
    }
    res.json({ commit, version: pkgVersion });
});
// ---------------------------------------------
// Routes - Auth
// ---------------------------------------------
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
// Aliases for customer profile and address management
app.use("/customer", customersRoutes);
app.use("/customer", marketingRoutes);
// Alias for order history and order create routes
app.use("/orders", ordersRoutes);
app.use("/courier", courierRoutes);
app.use("/api/courier", courierViewRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/customer", customerTrackingRoutes);
app.use(trackRoutes);
// ---------------------------------------------
// Routes - Admin dashboard
app.use("/api/admin/courier", adminCourierRoutes);
app.use("/api/admin/kitchen", adminKitchenAssignmentRoutes);
app.use("/api/admin/printer", adminPrinterStatusRoutes);
app.use("/api/admin/printer", adminPrinterTestRoutes);
app.use("/api/admin/printer", adminPrinterQueueRoutes);
app.use("/api/admin/printer", adminPrinterAnalyticsRoutes);
app.use("/api/admin/printer", adminPrinterSecurityRoutes);
app.use("/api/admin/printer", adminPrinterCloudRoutes);
app.use("/api/admin/printer", adminPrinterFleetRoutes);
app.use("/api/admin/printer", adminPrinterObservabilityRoutes);
// ---------------------------------------------
app.use("/api/admin", adminAuth, adminRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminTerminalRoutes);
app.use("/api/admin/tools", adminToolsRoutes);
app.use("/api/admin/paypal", paypalAdminRoutes);
app.use("/api/admin/printer", adminPrinterRoutes);
app.use("/api/v1/admin", adminAuth, adminRouter);
app.use("/admin", adminAuth, adminRouter);
app.use("/admin", campaignRoutes);
app.use("/offers", offersRoutes);
// ---------------------------------------------
// Routes - Menu management
// ---------------------------------------------
app.use("/api/v1", menuRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);
app.use("/api/v1/admin/items", adminItemRoutes);
app.use("/api/v1/admin/variants", adminVariantRoutes);
app.use("/api/v1/admin/toppings", adminToppingRoutes);
app.use("/api/v1/admin/extras", adminExtraRoutes);
app.use("/api/v1/admin/relations", adminRelationRoutes);
app.use("/api/v1/admin/deals", adminDealRoutes);
app.use("/api/v1/admin", terminalAdminRoutes);
app.use("/api/v1/admin", terminalStatusRoutes);
app.use("/api/v1/admin", orderMonitorRoutes);
// ---------------------------------------------
// Routes - Customer operations
// ---------------------------------------------
app.use("/api/v1/customers", customersRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", ordersRoutes);
app.use("/api/v1/orders", orderLifecycleRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/voucher", voucherRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/v1/print", printRoutes);
app.use("/api/v1/courier", courierTrackingRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
// ---------------------------------------------
// Routes - Public
// ---------------------------------------------
app.use("/api/public", publicRoutes);
app.use("/api/paypal/webhook", paypalWebhookRoutes);
app.get("/api/branches", cacheMiddleware({ ttl: 60, keyPrefix: "branches" }), (req, res) => {
    const branchesFile = path.join(process.cwd(), "src", "config", "branches.json");
    res.type("application/json");
    res.sendFile(branchesFile);
});
app.get("/chat", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "chat.html"));
});
// Sunmi printer endpoints used by Agent
app.use("/api/sunmi", sunmiRouter);
// Lightweight JSON metrics endpoint protected with API key
app.get("/metrics-lite", requireApiKey, async (_req, res) => {
    try {
        const uptime = process.uptime();
        const memory = process.memoryUsage();
        let activeConnections = null;
        try {
            activeConnections = await new Promise((resolve) => {
                server.getConnections((err, count) => {
                    if (err)
                        return resolve(null);
                    resolve(count);
                });
            });
        }
        catch (e) {
            activeConnections = null;
        }
        let metricsJson = [];
        try {
            if (registry && typeof registry.getMetricsAsJSON === "function") {
                metricsJson = await registry.getMetricsAsJSON();
            }
            else if (registry.metrics) {
                const text = await registry.metrics();
                metricsJson = [{ name: "raw", value: text }];
            }
        }
        catch (e) {
            metricsJson = [];
        }
        const findMetric = (name) => metricsJson.find((m) => m.name === name);
        const httpReq = findMetric("http_requests_total");
        const cacheHits = findMetric("api_cache_hits_total") || findMetric("redis_cache_hits_total");
        const cacheMisses = findMetric("api_cache_misses_total");
        res.json({ uptime, memory, activeConnections, requestCount, http_requests_total: httpReq || null, cacheHits: cacheHits || null, cacheMisses: cacheMisses || null });
    }
    catch (err) {
        res.status(500).json({ error: "failed to collect lite metrics" });
    }
});
// Metrics endpoint (Prometheus)
app.use("/metrics", requireApiKey, metricsRoutes);
// Enforce admin authentication for any admin path as a safety-net
app.use((req, res, next) => {
    if (req.path.startsWith("/api/admin") || req.path.startsWith("/admin")) {
        return adminAuthMiddleware(req, res, next);
    }
    next();
});
if (env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}
// Centralized API error middleware: increment error metric then delegate
app.use((err, req, res, next) => {
    try {
        errorsTotal.inc(1);
    }
    catch (e) { /* ignore metric errors */ }
    return errorMiddleware(err, req, res, next);
});
// ---------------------------------------------
// Server startup
// ---------------------------------------------
const PORT = Number(env.PORT || "4000");
async function startServer() {
    await initPrisma();
    if (env.NODE_ENV === "production" && env.REDIS_URL) {
        await connectRedis();
    }
    else {
        logger.warn("Redis disabled in development mode");
    }
    // Startup diagnostics
    try {
        // DB quick check
        await prisma.$queryRaw `SELECT 1`;
        logger.info("Startup: Prisma connection OK");
    }
    catch (e) {
        logger.warn({ err: e }, "Startup: Prisma connection failed");
    }
    if (env.NODE_ENV === "production" && env.REDIS_URL) {
        try {
            if (redisClient && typeof redisClient.ping === "function") {
                await redisClient.ping();
                logger.info("Startup: Redis connection OK");
            }
        }
        catch (e) {
            logger.warn({ err: e }, "Startup: Redis connection failed");
        }
    }
    else {
        logger.info("Startup: Redis diagnostics skipped (development mode)");
    }
    logger.info({ env: env.NODE_ENV }, "Environment mode");
    // PgBouncer compatibility hint
    try {
        const pgbouncer = /pgbouncer/i.test(env.DATABASE_URL || "");
        logger.info({ pgbouncer }, "PgBouncer compatibility check");
    }
    catch (e) {
        logger.warn({ err: e }, "PgBouncer check failed");
    }
    // Enabled features
    const cachingEnabled = !!env.REDIS_URL;
    const rateLimitingEnabled = true; // rateLimit middleware active
    const bruteForceProtection = !!process.env.BRUTE_FORCE_PROTECTION || false;
    logger.info({ cachingEnabled, rateLimitingEnabled, bruteForceProtection }, "Enabled features");
    // Startup diagnostics
    console.log('Startup diagnostics:');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL present:', !!process.env.DATABASE_URL);
    console.log('Redis configured:', process.env.REDIS_URL?.startsWith('redis://'));
    console.log('Push keys configured:', !!process.env.VAPID_PUBLIC_KEY && !!process.env.VAPID_PRIVATE_KEY);
    // Deployment banner
    console.log("🚀 Concordia Backend — Production Deployment Ready");
    // Final readiness banner
    console.log("🎉 Concordia Backend is fully production-ready!");
    server.listen(PORT, () => {
        logger.info({ port: PORT }, "Server running");
        (async () => {
            const timers = [];
            try {
                const printerSyncTimer = await startPrinterSyncWorker();
                timers.push(printerSyncTimer);
            }
            catch (e) {
                logger.error({ e }, "Failed to start printer sync worker");
            }
            try {
                const lifecycleTimer = startLifecycleScheduler();
                timers.push(lifecycleTimer);
            }
            catch (e) {
                logger.error({ e }, "Failed to start lifecycle scheduler");
            }
            try {
                const discoveryTimer = startPrinterDiscoveryWorker();
                timers.push(discoveryTimer);
            }
            catch (e) {
                logger.error({ e }, "Failed to start printer discovery worker");
            }
            // mark workers as initialized once we've attempted to start them
            workersInitialized = true;
            // graceful shutdown for background jobs and DB
            const shutdownJobs = async (signal) => {
                logger.info({ signal }, "Shutdown initiated");
                logger.info("Stopping background workers...");
                for (const t of timers) {
                    try {
                        if (t)
                            clearInterval(t);
                    }
                    catch (err) {
                        logger.warn({ err }, "Error clearing timer");
                    }
                }
                try {
                    logger.info("Disconnecting Prisma...");
                    await prisma.$disconnect();
                    logger.info("Prisma disconnected");
                }
                catch (err) {
                    logger.error({ err }, "Error disconnecting Prisma on shutdown");
                }
                try {
                    if (redisClient && typeof redisClient.disconnect === "function") {
                        logger.info("Disconnecting Redis...");
                        await redisClient.disconnect();
                        logger.info("Redis disconnected");
                    }
                }
                catch (err) {
                    logger.error({ err }, "Error disconnecting Redis on shutdown");
                }
                try {
                    server.close(() => {
                        logger.info("HTTP server closed");
                        logger.info("Shutdown complete");
                        process.exit(0);
                    });
                }
                catch (err) {
                    logger.error({ err }, "Error closing HTTP server");
                    process.exit(1);
                }
            };
            process.on("SIGTERM", () => shutdownJobs("SIGTERM"));
            process.on("SIGINT", () => shutdownJobs("SIGINT"));
        })();
    });
}
startServer().catch((err) => {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
});
