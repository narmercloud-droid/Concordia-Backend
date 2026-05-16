import dotenv from "dotenv";
dotenv.config();

import "./globalTypes.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import { adminAuth } from "./middleware/adminAuth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { metricsHandler, metricsMiddleware, startResourceSampling } from "./metrics/metrics.js";
import { setupGlobalErrorHandler } from "./lib/sentry.js";
import { requestLogger } from "./lib/logger.js";

// ---------------------------------------------
// 🔐 SAFE VAPID SETUP (Crash‑proof)
// ---------------------------------------------
import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(
      "mailto:support@example.com",
      publicKey,
      privateKey
    );
    console.log("🔐 Web Push enabled with VAPID keys");
  } catch (err: any) {
    console.error("⚠ Failed to initialize Web Push:", err.message);
    console.warn("⚠ Continuing without Web Push");
  }
} else {
  console.warn("⚠ Web Push disabled: missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY");
}

// ---------------------------------------------
// Core routes
// ---------------------------------------------
import menuRoutes from "./routes/menu.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import aiRoutes from "./routes/ai.routes.js";

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

// Public routes
import publicRoutes from "./routes/public.routes.js";

import { createServer } from "http";
import { Server } from "socket.io";
import { registerEvents } from "./events/index.js";
import { setIO } from "./lib/socket.js";
import { setIO as setSocketIO } from "./socket/index.js";
import { createConnectionLimitMiddleware, getConnectionStats } from "./socket/utils/connectionLimiter.js";
import { createRateLimitMiddleware } from "./socket/utils/rateLimiter.js";
import { startRoomCleanup, getGlobalMetrics, updateSocketRoomCount } from "./socket/utils/roomManager.js";
import { trackSocketBroadcast, trackSocketEmit, trackSocketConnectionDuration, trackSocketDisconnection, trackSocketRateLimitHit, trackSocketThrottledEvent, updateSocketBufferSize, updateSocketConnectionsPerIP } from "./metrics/metrics.js";

// ---------------------------------------------
// Express + Socket.IO setup
// ---------------------------------------------
const app = express();
const server = createServer(app);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// ===== PHASE 4: HEARTBEAT & TIMEOUT TUNING =====
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN ? process.env.SOCKET_ORIGIN.split(',') : ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  // ===== PERFORMANCE TUNING =====
  pingInterval: 15000,          // 15 seconds heartbeat
  pingTimeout: 30000,           // 30 seconds timeout
  upgradeTimeout: 10000,        // 10 seconds upgrade timeout
  maxHttpBufferSize: 1e6,       // 1MB max message size
  // ===== PHASE 9: BACKPRESSURE PROTECTION =====
  perMessageDeflate: false     // Disable compression to reduce CPU
});

setIO(io);
setSocketIO(io);

// ===== PHASE 7: REDIS ADAPTER FOR SCALING =====
import { redisClient } from "./lib/redis.js";
import { createAdapter } from "@socket.io/redis-adapter";

try {
  io.adapter(createAdapter(redisClient, redisClient.duplicate()));
  console.log("✅ Redis adapter enabled for Socket.IO scaling");
} catch (error) {
  console.warn("⚠️  Redis adapter initialization failed (continuing without it):", error);
}

// ===== PHASE 6: CONNECTION LIMITS PER IP & NAMESPACE =====
const connectionLimitConfig = {
  maxPerIP: 5,
  perNamespace: {
    "/orders": 10,
    "/couriers": 5,
    "/admin": 20,
    "/kds": 10,
  }
};

io.use(createConnectionLimitMiddleware(connectionLimitConfig));

// Initialize namespaces
const ordersNamespace = io.of("/orders");
const couriersNamespace = io.of("/couriers");
const kdsNamespace = io.of("/kds");
const adminNamespace = io.of("/admin");

// ===== PHASE 1: PER-NAMESPACE RATE LIMITING =====
// Apply rate limiting middleware with burst allowance (20 events/sec, 40 burst)
const rateConfig = {
  rate: 20,
  burst: 40,
  window: 1000
};

ordersNamespace.use(createRateLimitMiddleware({ ...rateConfig, rate: 30 }));
couriersNamespace.use(createRateLimitMiddleware({ ...rateConfig, rate: 40 }));
kdsNamespace.use(createRateLimitMiddleware({ ...rateConfig, rate: 50 }));
adminNamespace.use(createRateLimitMiddleware({ ...rateConfig, rate: 60 }));

// ===== PHASE 3: ROOM STRUCTURE & CLEANUP =====
// Start automatic cleanup of inactive rooms
const ordersCleanupInterval = startRoomCleanup(ordersNamespace);
const couriersCleanupInterval = startRoomCleanup(couriersNamespace);
const kdsCleanupInterval = startRoomCleanup(kdsNamespace);
const adminCleanupInterval = startRoomCleanup(adminNamespace);

// ===== PHASE 2 & 10: EVENT THROTTLING AND LOGGING =====
import { withThrottle, createThrottledEmitter, cleanupSocketThrottle } from "./socket/utils/throttler.js";
import { cleanupSocketRateLimit, getRateLimitStats } from "./socket/utils/rateLimiter.js";
import { cleanupSocketRooms, joinRoom } from "./socket/utils/roomManager.js";

// Orders namespace connection
ordersNamespace.on("connection", (socket) => {
  const clientIP = socket.handshake.address;
  
  console.log(`📱 Client connected to /orders: ${socket.id} from ${clientIP}`);
  updateSocketConnectionsPerIP(clientIP, getConnectionStats().totalIPsConnected || 0);

  // Track metrics
  const connectionStartTime = Date.now();

  socket.on("disconnect", (reason) => {
    const duration = (Date.now() - connectionStartTime) / 1000;
    trackSocketConnectionDuration("orders", duration);
    trackSocketDisconnection("orders", reason);
    console.log(`📱 Client disconnected from /orders: ${socket.id}, reason: ${reason}`);

    // Cleanup
    cleanupSocketThrottle(socket);
    cleanupSocketRateLimit(socket);
    cleanupSocketRooms(socket);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error on /orders (${socket.id}):`, error);
  });
});

// Couriers namespace connection
couriersNamespace.on("connection", (socket) => {
  const clientIP = socket.handshake.address;
  
  console.log(`🚗 Courier connected to /couriers: ${socket.id} from ${clientIP}`);
  updateSocketConnectionsPerIP(clientIP, getConnectionStats().totalIPsConnected || 0);

  const connectionStartTime = Date.now();
  
  // ===== PHASE 2: THROTTLE LOCATION UPDATES (1 update / 500ms) =====
  withThrottle(socket, "courier_location", (data) => {
    const start = Date.now();
    
    try {
      const { courierId, branchId } = data;
      if (!courierId) {
        console.warn(`⚠️  Missing courierId in location update`);
        return;
      }

      // Cache location in Redis for deduplication
      const locationKey = `courier:location:${courierId}`;
      redisClient.setEx(locationKey, 60, JSON.stringify(data)).catch(console.error);

      // Broadcast to others with latency tracking
      const duration = (Date.now() - start) / 1000;
      socket.broadcast.emit("courier_location_update", {
        ...data,
        timestamp: Date.now()
      });
      
      trackSocketBroadcast("courier_location", "couriers", duration);
    } catch (error) {
      console.error("❌ Error processing courier location:", error);
    }
  }, { interval: 500, trailing: true });

  socket.on("courier_status", (data) => {
    console.log(`Status update from courier ${data.courierId}: ${data.status}`);
    socket.broadcast.emit("courier_status_update", data);
  });

  socket.on("disconnect", (reason) => {
    const duration = (Date.now() - connectionStartTime) / 1000;
    trackSocketConnectionDuration("couriers", duration);
    trackSocketDisconnection("couriers", reason);
    console.log(`🚗 Courier disconnected from /couriers: ${socket.id}, reason: ${reason}`);

    // Cleanup
    cleanupSocketThrottle(socket);
    cleanupSocketRateLimit(socket);
    cleanupSocketRooms(socket);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error on /couriers (${socket.id}):`, error);
  });
});

// KDS namespace connection
kdsNamespace.on("connection", (socket) => {
  const clientIP = socket.handshake.address;
  
  console.log(`🍳 KDS connected to /kds: ${socket.id} from ${clientIP}`);
  updateSocketConnectionsPerIP(clientIP, getConnectionStats().totalIPsConnected || 0);

  const connectionStartTime = Date.now();

  // ===== PHASE 2: THROTTLE KITCHEN UPDATES (1 update / 300ms) =====
  withThrottle(socket, "kds_update", (data) => {
    const start = Date.now();
    
    try {
      socket.broadcast.emit("kds_update", {
        ...data,
        timestamp: Date.now()
      });

      const duration = (Date.now() - start) / 1000;
      trackSocketBroadcast("kds_update", "kds", duration);
    } catch (error) {
      console.error("❌ Error processing KDS update:", error);
    }
  }, { interval: 300, trailing: true });

  socket.on("disconnect", (reason) => {
    const duration = (Date.now() - connectionStartTime) / 1000;
    trackSocketConnectionDuration("kds", duration);
    trackSocketDisconnection("kds", reason);
    console.log(`🍳 KDS disconnected from /kds: ${socket.id}, reason: ${reason}`);

    // Cleanup
    cleanupSocketThrottle(socket);
    cleanupSocketRateLimit(socket);
    cleanupSocketRooms(socket);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error on /kds (${socket.id}):`, error);
  });
});

// Admin namespace connection
adminNamespace.on("connection", (socket) => {
  const clientIP = socket.handshake.address;
  
  console.log(`👨‍💼 Admin connected to /admin: ${socket.id} from ${clientIP}`);
  updateSocketConnectionsPerIP(clientIP, getConnectionStats().totalIPsConnected || 0);

  const connectionStartTime = Date.now();

  // ===== PHASE 2: THROTTLE DASHBOARD PUSHES (1 update / 1000ms) =====
  withThrottle(socket, "admin_dashboard_update", (data) => {
    const start = Date.now();
    
    try {
      socket.broadcast.emit("admin_dashboard_update", {
        ...data,
        timestamp: Date.now()
      });

      const duration = (Date.now() - start) / 1000;
      trackSocketBroadcast("admin_dashboard_update", "admin", duration);
    } catch (error) {
      console.error("❌ Error processing admin dashboard update:", error);
    }
  }, { interval: 1000, trailing: true });

  socket.on("disconnect", (reason) => {
    const duration = (Date.now() - connectionStartTime) / 1000;
    trackSocketConnectionDuration("admin", duration);
    trackSocketDisconnection("admin", reason);
    console.log(`👨‍💼 Admin disconnected from /admin: ${socket.id}, reason: ${reason}`);

    // Cleanup
    cleanupSocketThrottle(socket);
    cleanupSocketRateLimit(socket);
    cleanupSocketRooms(socket);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error on /admin (${socket.id}):`, error);
  });
});

registerEvents(io);

// ---------------------------------------------
// Connect to Redis
// ---------------------------------------------
import { connectRedis } from "./lib/redis.js";
connectRedis().catch(console.error);

// ===== COMPRESSION, CACHING, AND PROFILE MIDDLEWARE =====
import compression from "compression";
import zlib from "zlib";
import { cacheRoute } from "./middleware/cache.js";
import { profileMiddleware } from "./middleware/profile.js";

const compressionOptions: any = {
  level: 6,
  threshold: 1024,
  filter: (req: any, res: any) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }

    const path = req.originalUrl || req.url || "";
    if (path.startsWith("/metrics") || path.startsWith("/health") || path.startsWith("/socket.io")) {
      return false;
    }

    return compression.filter(req, res);
  }
};

if (typeof zlib.createBrotliCompress === "function") {
  compressionOptions.brotli = {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 6
  };
}

app.use(compression(compressionOptions));

// Route-level caching for API GET endpoints
app.use("/api/v1", cacheRoute(60));
app.use("/api/v1/ai", cacheRoute(30));
app.use("/api/v1/admin/categories", cacheRoute(60));
app.use("/api/v1/dashboard", cacheRoute(10));
app.use("/api/public", cacheRoute(300));

// Request size limits
app.use(express.json({ limit: "1mb" }));      // JSON: 1MB
app.use(express.urlencoded({ limit: "500kb", extended: false })); // URL-encoded: 500KB
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    return res.status(413).json({
      success: false,
      error: {
        code: "MULTIPART_DISABLED",
        message: "Multipart uploads are disabled."
      }
    });
  }

  next();
});

app.use(profileMiddleware);

// ---------------------------------------------
// Middleware
// ---------------------------------------------
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(rateLimit());
app.use(mongoSanitize());

// ---------------------------------------------
// Observability Middleware
// ---------------------------------------------
app.use(requestLogger);
app.use(metricsMiddleware);

// ---------------------------------------------
// Global Error Handler (Sentry)
// ---------------------------------------------
setupGlobalErrorHandler(app);

// ---------------------------------------------
// Routes - Health Check
// ---------------------------------------------
app.use("/health", healthRouter);

// ---------------------------------------------
// Routes - Metrics (Prometheus)
// ---------------------------------------------
app.get("/metrics", metricsHandler);

// ---------------------------------------------
// Routes - Auth
// ---------------------------------------------
app.use("/api/auth", authRouter);

// ---------------------------------------------
// Routes - Admin dashboard
// ---------------------------------------------
app.use("/api/v1/admin", adminAuth, adminRouter);
app.use("/api/v1/admin/analytics", analyticsRoutes);

// ---------------------------------------------
// Routes - AI/ML Intelligence Layer
// ---------------------------------------------
app.use("/api/v1/ai", aiRoutes);
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
app.use("/api/v1/print", printRoutes);
app.use("/api/v1/courier", courierTrackingRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ---------------------------------------------
// Routes - Public
// ---------------------------------------------
app.use("/api/public", publicRoutes);
// ---------------------------------------------
// Global error handler
// ---------------------------------------------
import logger from "./lib/logger.js";

app.use((err: any, req, res, _next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  }, "Unhandled error:");

  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === "production";
  const errorMessage = isProduction ? "Internal server error" : err.message;

  return res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "UNHANDLED_EXCEPTION",
      message: errorMessage
    }
  });
});

// ---------------------------------------------
// Server startup
// ---------------------------------------------
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.io on port ${PORT}`);
  
  // Start resource sampling for Node.js metrics
  startResourceSampling();
});

