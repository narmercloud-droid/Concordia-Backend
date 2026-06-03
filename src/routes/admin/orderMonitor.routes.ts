import express from "express";
const { Router } = express;
import { OrderMonitorController } from "../../controllers/admin/orderMonitor.controller.ts";

const router = Router();

router.get("/orders/live", OrderMonitorController.getLiveOrders);

export default router;






