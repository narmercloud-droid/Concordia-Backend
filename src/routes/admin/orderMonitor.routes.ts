import { Router } from "express";
import { OrderMonitorController } from "../../controllers/admin/orderMonitor.controller.js";

const router = Router();

router.get("/orders/live", OrderMonitorController.getLiveOrders);

export default router;






