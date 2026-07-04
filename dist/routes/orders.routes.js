import express from "express";
const { Router } = express;
import { OrdersController } from "../controllers/orders.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
import { courierAuth } from "../middleware/courierAuth.js";
const router = Router();
// Customer checkout
router.post("/", OrdersController.create);
// Abandon PayPal/card checkout before payment completes
router.post("/:id/cancel-unpaid", OrdersController.cancelUnpaid);
// Customer order tracking
router.get("/:id/status", OrdersController.getStatus);
// Branch orders
router.get("/branch/:branchId", adminAuth, adminRole("manager"), OrdersController.listBranchOrders);
// Terminal updates order status
router.put("/:id/status", adminAuth, adminRole("manager"), OrdersController.updateStatus);
// Courier flow
router.post("/courier/claim", courierAuth, OrdersController.courierClaim);
router.post("/courier/picked-up", courierAuth, OrdersController.courierPickedUp);
router.post("/courier/delivered", courierAuth, OrdersController.courierDelivered);
export default router;
