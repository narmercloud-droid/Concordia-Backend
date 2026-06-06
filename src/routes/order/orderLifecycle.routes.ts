import express from "express";
import { OrderLifecycleController } from "../../controllers/order/orderLifecycle.controller.ts";
import { customerAuth } from "../../middleware/customerAuth.ts";

const router = express.Router();

// Order creation
router.post("/create", customerAuth, OrderLifecycleController.createOrder);

// Payment confirmation
router.post("/confirm-payment", customerAuth, OrderLifecycleController.confirmExternalPayment);

// Order lifecycle routes
router.post("/:id/preparing", OrderLifecycleController.preparing);
router.post("/:id/ready", OrderLifecycleController.ready);
router.post("/:id/completed", OrderLifecycleController.completed);
router.post("/:id/reject", OrderLifecycleController.reject);

export default router;




