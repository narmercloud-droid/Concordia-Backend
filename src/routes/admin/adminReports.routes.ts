import express from "express";
import { AdminRevenueReportController } from "../../controllers/admin/adminRevenueReport.controller.ts";

const router = express.Router();

router.get("/revenue", AdminRevenueReportController.report);
router.get("/revenue/pdf", AdminRevenueReportController.pdf);

export default router;
