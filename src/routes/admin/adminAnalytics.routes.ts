import express from "express";
import { AdminAnalyticsController } from "../../controllers/admin/adminAnalytics.controller.ts";

const router = express.Router();

router.get("/sales", AdminAnalyticsController.sales);
router.get("/order-volume", AdminAnalyticsController.orderVolume);
router.get("/category-performance", AdminAnalyticsController.categoryPerformance);
router.get("/branch-performance", AdminAnalyticsController.branchPerformance);
router.get("/peak-hours", AdminAnalyticsController.peakHours);
router.get("/top-items", AdminAnalyticsController.topItems);

export default router;
