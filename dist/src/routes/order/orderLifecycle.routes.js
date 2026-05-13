import express from "express";
import { OrderLifecycleController } from "../../controllers/order/orderLifecycle.controller.js";
const router = express.Router();
// Order lifecycle routes
router.post("/:id/preparing", OrderLifecycleController.preparing);
router.post("/:id/ready", OrderLifecycleController.ready);
router.post("/:id/completed", OrderLifecycleController.completed);
router.post("/:id/reject", OrderLifecycleController.reject);
export default router;
