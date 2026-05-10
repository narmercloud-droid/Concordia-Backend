"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderMonitor_controller_1 = require("../../controllers/admin/orderMonitor.controller");
const router = (0, express_1.Router)();
router.get("/orders/live", orderMonitor_controller_1.OrderMonitorController.getLiveOrders);
exports.default = router;
