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
import { success } from "./controllers/controllerHelper.js";
// ---------------------------------------------
// ðŸ” SAFE VAPID SETUP (Crashâ€‘proof)
// ---------------------------------------------
import webpush from "web-push";
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
if (publicKey && privateKey) {
    try {
        webpush.setVapidDetails("mailto:support@example.com", publicKey, privateKey);
        console.log("ðŸ” Web Push enabled with VAPID keys");
    }
    catch (err) {
        console.error("âš  Failed to initialize Web Push:", err.message);
        console.warn("âš  Continuing without Web Push");
    }
}
else {
    console.warn("âš  Web Push disabled: missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY");
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
import { startPrinterSyncWorker } from "./jobs/printerCloudSyncWorker.js";
// Public routes
import publicRoutes from "./routes/public.routes.js";
import sunmiRouter from "./routes/sunmi.js";
import http from "http";
import { initSocket } from "./websocket/socketServer.js";
import { registerEvents } from "./events/index.js";
import { setIO } from "./lib/socket.js";
import { initPrisma } from "./prisma/client.js";
import { startLifecycleScheduler } from "./jobs/lifecycleScheduler.js";
import { connectRedis } from "./redis/client.js";
import { env } from "./config/env.js";
import logger from "./utils/logger.js";
import metricsRoutes from "./routes/metrics.js";
import { httpRequestsTotal, httpRequestDurationSeconds, errorsTotal } from "./metrics/metrics.js";
// ---------------------------------------------
// Express + Socket.IO setup
// ---------------------------------------------
const app = express();
const server = http.createServer(app);
const io = initSocket(server);
setIO(io);
registerEvents(io);
// ---------------------------------------------
// Production middleware
// ---------------------------------------------
const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(helmet());
app.use(cors(corsOptions));
// Metrics middleware: measure duration and increment counters
app.use((req, res, next) => {
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
app.get("/health", (_req, res) => {
    return success(res, { status: "ok" }, "OK");
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
app.get("/api/branches", (req, res) => {
    const branchesFile = path.join(process.cwd(), "src", "config", "branches.json");
    res.type("application/json");
    res.sendFile(branchesFile);
});
app.get("/chat", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "chat.html"));
});
// Sunmi printer endpoints used by Agent
app.use("/api/sunmi", sunmiRouter);
// Metrics endpoint (Prometheus)
app.use("/metrics", metricsRoutes);
if (env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}
app.use((err, req, res, _next) => {
    logger.error({ err, method: req.method, url: req.originalUrl }, "Unhandled server error");
    try {
        errorsTotal.inc(1);
    }
    catch (e) { /* ignore metric errors */ }
    res.status(500).json({ error: "Internal Server Error" });
});
// ---------------------------------------------
// Server startup
// ---------------------------------------------
const PORT = Number(env.PORT || "4000");
async function startServer() {
    await initPrisma();
    await connectRedis();
    server.listen(PORT, () => {
        logger.info({ port: PORT }, "Server running");
        startPrinterSyncWorker();
        startLifecycleScheduler();
    });
}
startServer().catch((err) => {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
});
