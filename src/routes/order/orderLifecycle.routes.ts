import express from "express";
import { OrderLifecycleController } from "../../controllers/order/orderLifecycle.controller.ts";
import { customerAuth } from "../../middleware/customerAuth.ts";
import { terminalOrAdminAuth } from "../../middleware/terminalOrAdminAuth.ts";

const router = express.Router();

// Order creation
router.post("/create", customerAuth, OrderLifecycleController.createOrder);

// Payment confirmation (further hardened in payment phase)
router.post("/confirm-payment", customerAuth, OrderLifecycleController.confirmExternalPayment);

// Kitchen lifecycle — terminal or admin/manager only
router.post("/:id/preparing", terminalOrAdminAuth, OrderLifecycleController.preparing);
router.post("/:id/ready", terminalOrAdminAuth, OrderLifecycleController.ready);
router.post("/:id/completed", terminalOrAdminAuth, OrderLifecycleController.completed);
router.post("/:id/reject", terminalOrAdminAuth, OrderLifecycleController.reject);

export default router;
