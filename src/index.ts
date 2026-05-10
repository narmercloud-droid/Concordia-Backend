import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import { verifyAdmin } from "./middleware/auth";

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

import cartRoutes from "./routes/cart/cart.routes";
import orderRoutes from "./routes/order/order.routes";
import orderLifecycleRoutes from "./routes/order/orderLifecycle.routes";
import printRoutes from "./routes/print/print.routes";
import terminalRoutes from "./routes/terminal.routes";

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
import { startTerminalStatusJob } from "./jobs/terminalStatus.job";
startTerminalStatusJob();

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
app.use("/api/v1/admin", verifyAdmin, adminRouter);

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

// Terminal activation
app.use("/api/v1/terminal", terminalRoutes);

// KDS
import kdsRoutes from "./routes/kds.routes";
app.use("/api/v1/kds", kdsRoutes);

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

