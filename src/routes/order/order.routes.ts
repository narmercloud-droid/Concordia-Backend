import { Router } from "express";
import { OrderController } from "../../controllers/order/order.controller";
import { validate } from "../../middleware/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../../schemas/orderSchemas";

const router = Router();

// -----------------------------------------------------
// CREATE ORDER
// -----------------------------------------------------
router.post("/create", validate(createOrderSchema), OrderController.createOrder);

// -----------------------------------------------------
// UPDATE ORDER STATUS
// (pending → accepted → preparing → ready → delivered)
// -----------------------------------------------------
router.put("/:orderId/status", validate(updateOrderStatusSchema), OrderController.updateStatus);

// -----------------------------------------------------
// COURIER PICKUP (QR CODE SCAN)
// -----------------------------------------------------
router.put("/:orderId/picked-up", OrderController.courierPickup);

// -----------------------------------------------------
// GET ACTIVE ORDERS (Kitchen Dashboard)
// -----------------------------------------------------
router.get("/active", OrderController.getActiveOrders);

// -----------------------------------------------------
// GET ORDER BY ID
// -----------------------------------------------------
router.get("/:orderId", OrderController.getOrder);

export default router;
