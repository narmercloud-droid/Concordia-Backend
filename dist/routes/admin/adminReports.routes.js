import express from "express";
import { AdminRevenueReportController } from "../../controllers/admin/adminRevenueReport.controller.js";
const router = express.Router();
router.get("/revenue", AdminRevenueReportController.report);
router.get("/revenue/pdf", AdminRevenueReportController.pdf);
export default router;
