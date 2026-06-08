import express from "express";
const { Router } = express;
import {
  getTerminalOrders,
  getTerminalOrderDetails,
  activateTerminalByCode,
  confirmTerminalOrder,
  getTerminalDailyReportHandler
} from "../../controllers/terminal/terminalOrders.controller.ts";

const router = Router();

router.post("/activate", activateTerminalByCode);
router.get("/orders", getTerminalOrders);
router.get("/daily-report", getTerminalDailyReportHandler);
router.get("/order/:id", getTerminalOrderDetails);
router.post("/orders/:id/confirm", confirmTerminalOrder);

export default router;

