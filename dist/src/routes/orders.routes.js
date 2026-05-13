import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Customer checkout
router.post("/", OrdersController.create);
// Branch orders
router.get("/branch/:branchId", adminAuth, adminRole("manager"), OrdersController.listBranchOrders);
// Terminal updates order status
router.put("/:id/status", adminAuth, adminRole("manager"), OrdersController.updateStatus);
// Courier flow
router.post("/courier/claim", OrdersController.courierClaim);
router.post("/courier/picked-up", OrdersController.courierPickedUp);
router.post("/courier/delivered", OrdersController.courierDelivered);
export default router;
