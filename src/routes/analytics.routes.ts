import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";

const router = Router();

// Manager-only analytics
router.get("/revenue", adminAuth, adminRole("manager"), AnalyticsController.totalRevenue);
router.get("/orders-per-day", adminAuth, adminRole("manager"), AnalyticsController.ordersPerDay);
router.get("/best-selling-items", adminAuth, adminRole("manager"), AnalyticsController.bestSellingItems);
router.get("/customer-stats", adminAuth, adminRole("manager"), AnalyticsController.customerStats);
router.get("/courier-performance", adminAuth, adminRole("manager"), AnalyticsController.courierPerformance);
router.get("/hourly-orders", adminAuth, adminRole("manager"), AnalyticsController.hourlyOrders);

export default router;







