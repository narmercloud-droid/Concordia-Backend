import dotenv from "dotenv";
dotenv.config();
import "./globalTypes";
import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import { adminAuth } from "./middleware/adminAuth";
import menuRoutes from "./routes/menu.routes";
import adminCategoryRoutes from "./routes/admin/category.routes";
import adminItemRoutes from "./routes/admin/item.routes";
import adminVariantRoutes from "./routes/admin/variant.routes";
import adminToppingRoutes from "./routes/admin/topping.routes";
import adminExtraRoutes from "./routes/admin/extra.routes";
import adminRelationRoutes from "./routes/admin/relation.routes";
import adminDealRoutes from "./routes/admin/deal.routes";
import terminalAdminRoutes from "./routes/admin/terminalAdmin.routes";
import terminalStatusRoutes from "./routes/admin/terminalStatus.routes";
import orderMonitorRoutes from "./routes/admin/orderMonitor.routes";
import analyticsRoutes from "./routes/analytics.routes";
import behaviorPredictionRoutes from "./routes/behaviorPrediction.routes";
import decisionEngineRoutes from "./routes/decisionEngine.routes";
import dynamicPricingRoutes from "./routes/dynamicPricing.routes";
import forecastingRoutes from "./routes/forecasting.routes";
import intelligenceRoutes from "./routes/intelligence.routes";
import knowledgeGraphRoutes from "./routes/knowledgeGraph.routes";
import ltmlRoutes from "./routes/ltml.routes";
import ltvChurnRoutes from "./routes/ltvChurn.routes";
import menuOptimizationRoutes from "./routes/menuOptimization.routes";
import nlaeRoutes from "./routes/nlae.routes";
import optimizationLoopRoutes from "./routes/optimizationLoop.routes";
import orchestrationRoutes from "./routes/orchestration.routes";
import conversationalRoutes from "./routes/conversational.routes";
import managerDashboardRoutes from "./routes/managerDashboard.routes";
import cartRoutes from "./routes/cart/cart.routes";
import orderRoutes from "./routes/order/order.routes";
import orderLifecycleRoutes from "./routes/order/orderLifecycle.routes";
import printRoutes from "./routes/print/print.routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerEvents } from "./events";
import { setIO } from "./lib/socket";
// -----------------------------------------------------
// EXPRESS + SOCKET.IO SETUP
// -----------------------------------------------------
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});
setIO(io);
registerEvents(io);
// Start terminal status job
// (Disabled: legacy terminal job depends on Prisma models not present in current schema.)
// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------
app.use(cors());
app.use(express.json());
// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
// Public route (login)
app.use("/api/auth", authRouter);
// Protected admin routes
app.use("/api/v1/admin", adminAuth, adminRouter);
// AI and manager routes
app.use("/api/v1/admin/analytics", analyticsRoutes);
app.use("/api/v1/admin/behavior-prediction", behaviorPredictionRoutes);
app.use("/api/v1/admin/decision-engine", decisionEngineRoutes);
app.use("/api/v1/admin/dynamic-pricing", dynamicPricingRoutes);
app.use("/api/v1/admin/forecasting", forecastingRoutes);
app.use("/api/v1/admin/intelligence", intelligenceRoutes);
app.use("/api/v1/admin/knowledge-graph", knowledgeGraphRoutes);
app.use("/api/v1/admin/ltml", ltmlRoutes);
app.use("/api/v1/admin/ltv-churn", ltvChurnRoutes);
app.use("/api/v1/admin/menu-optimization", menuOptimizationRoutes);
app.use("/api/v1/admin/nlae", nlaeRoutes);
app.use("/api/v1/admin/optimization-loop", optimizationLoopRoutes);
app.use("/api/v1/admin/orchestration", orchestrationRoutes);
app.use("/api/v1/admin/conversational", conversationalRoutes);
app.use("/api/v1/admin/manager-dashboard", managerDashboardRoutes);
// Menu + Admin
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
// Cart
app.use("/api/v1/cart", cartRoutes);
// Orders
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/orders", orderLifecycleRoutes);
// Terminal activation (disabled: legacy terminal subsystem depends on missing prisma models/fields)
// app.use("/api/v1/terminal", terminalRoutes);
// KDS (disabled: legacy KDS subsystem depends on missing prisma models/fields)
// import kdsRoutes from "./routes/kds.routes.js";
// app.use("/api/kds", kdsRoutes);
// Printing
app.use("/api/v1/print", printRoutes);
// Public tracking API
import publicRoutes from "./routes/public.routes";
app.use("/api/public", publicRoutes);
// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running with Socket.io on port ${PORT}`);
});
