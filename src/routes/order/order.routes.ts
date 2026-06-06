import express from "express";
const { Router } = express;
import { OrderController } from "../../controllers/order/order.controller.ts";
import { confirmExternalPayment } from "../../controllers/order/orderLifecycle.controller.ts";
import { customerAuth } from "../../middleware/customerAuth.ts";
import { adminAuth } from "../../middleware/adminAuth.ts";
import { validate } from "../../middleware/validate.ts";
import { createOrderSchema, updateOrderStatusSchema } from "../../schemas/orderSchemas.ts";

const router = Router();

// -----------------------------------------------------
// CREATE ORDER
// -----------------------------------------------------
router.post("/create", customerAuth, validate(createOrderSchema), OrderController.createOrder);

// -----------------------------------------------------
// UPDATE ORDER STATUS
// (pending â†’ accepted â†’ preparing â†’ ready â†’ delivered)
// -----------------------------------------------------
router.put("/:orderId/status", adminAuth, validate(updateOrderStatusSchema), OrderController.updateStatus);

router.post("/confirm-payment", customerAuth, confirmExternalPayment);

// -----------------------------------------------------
// COURIER PICKUP (QR CODE SCAN)
// -----------------------------------------------------
router.put("/:orderId/picked-up", adminAuth, OrderController.courierPickup);

// -----------------------------------------------------
// GET ACTIVE ORDERS (Kitchen Dashboard)
// -----------------------------------------------------
router.get("/active", adminAuth, OrderController.getActiveOrders);

// -----------------------------------------------------
// GET ORDER BY ID
// -----------------------------------------------------
router.get("/:orderId", adminAuth, OrderController.getOrder);

export default router;








