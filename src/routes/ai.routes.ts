import { Router } from "express";
import { AnalyticsController } from "../controllers/ai/analytics.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// AI/ML Intelligence Layer Routes
// All routes require admin authentication

// Customer analytics
router.get("/customer/:id/churn", adminAuth, AnalyticsController.getCustomerChurnRisk);
router.get("/customer/:id/ltv", adminAuth, AnalyticsController.getCustomerLTV);

// Menu analytics
router.get("/menu/top", adminAuth, AnalyticsController.getTopMenuItems);

// Courier analytics
router.get("/courier/:id/performance", adminAuth, AnalyticsController.getCourierPerformance);

// Branch demand forecasting
router.get("/branch/:id/demand", adminAuth, AnalyticsController.getBranchDemand);

// Recommendations
router.get("/recommendations/:customerId", adminAuth, AnalyticsController.getRecommendations);

export default router;