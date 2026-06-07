import express from "express";
const { Router } = express;
import {
  getTerminalOrders,
  getTerminalOrderDetails,
  activateTerminalByCode,
  confirmTerminalOrder
} from "../../controllers/terminal/terminalOrders.controller.ts";

const router = Router();

router.post("/activate", activateTerminalByCode);
router.get("/orders", getTerminalOrders);
router.get("/order/:id", getTerminalOrderDetails);
router.post("/orders/:id/confirm", confirmTerminalOrder);

export default router;

