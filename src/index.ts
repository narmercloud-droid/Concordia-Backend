import dotenv from "dotenv";
dotenv.config();

import "./globalTypes.js";

import express from "express";
import cors from "cors";

import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import { adminAuth } from "./middleware/adminAuth.js";

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

// ---------------------------------------------
// Express + Socket.IO setup
// ---------------------------------------------
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

setIO(io);
registerEvents(io);

// ---------------------------------------------
// Middleware
// ---------------------------------------------
app.use(cors());
app.use(express.json());

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
// Server startup
// ---------------------------------------------
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.io on port ${PORT}`);
});
