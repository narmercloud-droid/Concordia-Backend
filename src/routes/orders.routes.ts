import express from "express";
const { Router } = express;
import { OrdersController } from "../controllers/orders.controller.ts";
import { adminAuth } from "../middleware/adminAuth.ts";
import { adminRole } from "../middleware/adminRole.ts";
import { courierAuth } from "../middleware/courierAuth.ts";
import { optionalCustomerAuth } from "../middleware/optionalCustomerAuth.ts";

const router = Router();

// Customer checkout
router.post("/", OrdersController.create);

// Abandon PayPal/card checkout before payment completes
router.post("/:id/cancel-unpaid", optionalCustomerAuth, OrdersController.cancelUnpaid);

// Customer order tracking
router.get("/:id/status", OrdersController.getStatus);

// Branch orders
router.get("/branch/:branchId", adminAuth, adminRole("manager"), OrdersController.listBranchOrders);

// Manager updates order status
router.put("/:id/status", adminAuth, adminRole("manager"), OrdersController.updateStatus);

// Courier flow
router.post("/courier/claim", courierAuth, OrdersController.courierClaim);
router.post("/courier/picked-up", courierAuth, OrdersController.courierPickedUp);
router.post("/courier/delivered", courierAuth, OrdersController.courierDelivered);

export default router;
