"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../../controllers/order/order.controller");
const validate_1 = require("../../middleware/validate");
const orderSchemas_1 = require("../../schemas/orderSchemas");
const router = (0, express_1.Router)();
// -----------------------------------------------------
// CREATE ORDER
// -----------------------------------------------------
router.post("/create", (0, validate_1.validate)(orderSchemas_1.createOrderSchema), order_controller_1.OrderController.createOrder);
// -----------------------------------------------------
// UPDATE ORDER STATUS
// (pending → accepted → preparing → ready → delivered)
// -----------------------------------------------------
router.put("/:orderId/status", (0, validate_1.validate)(orderSchemas_1.updateOrderStatusSchema), order_controller_1.OrderController.updateStatus);
// -----------------------------------------------------
// COURIER PICKUP (QR CODE SCAN)
// -----------------------------------------------------
router.put("/:orderId/picked-up", order_controller_1.OrderController.courierPickup);
// -----------------------------------------------------
// GET ACTIVE ORDERS (Kitchen Dashboard)
// -----------------------------------------------------
router.get("/active", order_controller_1.OrderController.getActiveOrders);
// -----------------------------------------------------
// GET ORDER BY ID
// -----------------------------------------------------
router.get("/:orderId", order_controller_1.OrderController.getOrder);
exports.default = router;
