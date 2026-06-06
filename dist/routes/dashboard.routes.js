import express from "express";
const { Router } = express;
import { DashboardController } from "../controllers/dashboard.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { adminRole } from "../middleware/adminRole.js";
const router = Router();
// Admin-only global analytics
router.get("/global/revenue", adminAuth, adminRole("admin"), DashboardController.globalRevenue);
router.get("/global/orders", adminAuth, adminRole("admin"), DashboardController.globalOrders);
router.get("/global/searches", adminAuth, adminRole("admin"), DashboardController.topSearches);
router.get("/global/loyalty", adminAuth, adminRole("admin"), DashboardController.loyaltyStats);
router.get("/global/customers", adminAuth, adminRole("admin"), DashboardController.customerStats);
// Manager branch analytics
router.get("/branch/:branchId/revenue", adminAuth, adminRole("manager"), DashboardController.branchRevenue);
router.get("/branch/:branchId/orders", adminAuth, adminRole("manager"), DashboardController.branchOrders);
router.get("/branch/:branchId/menu", adminAuth, adminRole("manager"), DashboardController.menuPerformance);
router.get("/branch/:branchId/couriers", adminAuth, adminRole("manager"), DashboardController.courierPerformance);
export default router;
