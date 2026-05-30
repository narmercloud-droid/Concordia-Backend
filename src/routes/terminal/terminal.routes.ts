import { Router } from "express";
import { getTerminalOrders, getTerminalOrderDetails } from "../../controllers/terminal/terminalOrders.controller.js";

const router = Router();

router.get("/orders", getTerminalOrders);
router.get("/order/:id", getTerminalOrderDetails);

export default router;

