"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const category_routes_1 = __importDefault(require("./routes/admin/category.routes"));
const item_routes_1 = __importDefault(require("./routes/admin/item.routes"));
const variant_routes_1 = __importDefault(require("./routes/admin/variant.routes"));
const topping_routes_1 = __importDefault(require("./routes/admin/topping.routes"));
const extra_routes_1 = __importDefault(require("./routes/admin/extra.routes"));
const relation_routes_1 = __importDefault(require("./routes/admin/relation.routes"));
const deal_routes_1 = __importDefault(require("./routes/admin/deal.routes"));
const terminalAdmin_routes_1 = __importDefault(require("./routes/admin/terminalAdmin.routes"));
const terminalStatus_routes_1 = __importDefault(require("./routes/admin/terminalStatus.routes"));
const orderMonitor_routes_1 = __importDefault(require("./routes/admin/orderMonitor.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order/order.routes"));
const print_routes_1 = __importDefault(require("./routes/print/print.routes"));
const terminal_routes_1 = __importDefault(require("./routes/terminal.routes"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const events_1 = require("./events");
const socket_1 = require("./lib/socket");
// -----------------------------------------------------
// EXPRESS + SOCKET.IO SETUP
// -----------------------------------------------------
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    }
});
(0, socket_1.setIO)(io);
(0, events_1.registerEvents)(io);
// Start terminal status job
const terminalStatus_job_1 = require("./jobs/terminalStatus.job");
(0, terminalStatus_job_1.startTerminalStatusJob)();
// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
// Public route (login)
app.use("/api/auth", auth_1.default);
// Protected admin routes
app.use("/api/admin", auth_2.verifyAdmin, admin_1.default);
// Menu + Admin
app.use("/api/v1", menu_routes_1.default);
app.use("/api/v1/admin/categories", category_routes_1.default);
app.use("/api/v1/admin/items", item_routes_1.default);
app.use("/api/v1/admin/variants", variant_routes_1.default);
app.use("/api/v1/admin/toppings", topping_routes_1.default);
app.use("/api/v1/admin/extras", extra_routes_1.default);
app.use("/api/v1/admin/relations", relation_routes_1.default);
app.use("/api/v1/admin/deals", deal_routes_1.default);
app.use("/api/admin", terminalAdmin_routes_1.default);
app.use("/api/admin", terminalStatus_routes_1.default);
app.use("/api/admin", orderMonitor_routes_1.default);
// Cart
app.use("/api/v1/cart", cart_routes_1.default);
// Orders
app.use("/api/v1/order", order_routes_1.default);
// Terminal activation
app.use("/api/v1/terminal", terminal_routes_1.default);
// Printing
app.use("/api/v1/print", print_routes_1.default);
// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running with Socket.io on port ${PORT}`);
});
