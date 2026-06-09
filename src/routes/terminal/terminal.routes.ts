import express from "express";
const { Router } = express;
import {
  getTerminalOrders,
  getTerminalOrderDetails,
  activateTerminalByCode,
  confirmTerminalOrder,
  getTerminalDailyReportHandler,
  rejectTerminalOrder,
  getTerminalBranchStatus,
  updateTerminalBranchStatus
} from "../../controllers/terminal/terminalOrders.controller.ts";

const router = Router();

router.post("/activate", activateTerminalByCode);
router.get("/orders", getTerminalOrders);
router.get("/daily-report", getTerminalDailyReportHandler);
router.get("/branch/status", getTerminalBranchStatus);
router.patch("/branch/status", updateTerminalBranchStatus);
router.get("/order/:id", getTerminalOrderDetails);
router.post("/orders/:id/confirm", confirmTerminalOrder);
router.post("/orders/:id/reject", rejectTerminalOrder);

export default router;

