import express from "express";
const { Router } = express;
import { TerminalController } from "../controllers/terminal/terminal.controller.ts";
import { validateTerminalToken, terminalAuth } from "../middleware/terminalAuth.ts";
import { validate } from "../middleware/validate.ts";
import { activateTerminalSchema, registerTerminalSchema, loginTerminalSchema } from "../schemas/terminalSchemas.ts";
import { assignOrderSchema, acceptOrderSchema, rejectOrderSchema } from "../schemas/orderWorkflowSchemas.ts";
import { updateTerminalHeartbeat } from "../services/terminal/terminalStatus.service.ts";
import { reportTerminalError } from "../services/terminal/terminalError.service.ts";
import { acceptOrder, rejectOrder } from "../controllers/terminal/terminalOrders.controller.ts";

const router = Router();

router.post("/activate", validate(activateTerminalSchema), TerminalController.activate);
router.post("/register", validate(registerTerminalSchema), TerminalController.register);
router.post("/login", validate(loginTerminalSchema), TerminalController.login);
router.post("/heartbeat", validateTerminalToken, TerminalController.heartbeat);
router.post("/orders/:order_id/assign", validateTerminalToken, validate(assignOrderSchema), TerminalController.assignOrder);
router.post("/orders/:order_id/accept", validateTerminalToken, validate(acceptOrderSchema), TerminalController.acceptOrder);
router.post("/orders/:order_id/reject", validateTerminalToken, validate(rejectOrderSchema), TerminalController.rejectOrder);
router.post("/orders/:order_id/acknowledge", validateTerminalToken, TerminalController.acknowledgeOrder);
router.get("/orders/stream", validateTerminalToken, TerminalController.ordersStream);

// New terminal observability routes
router.post("/heartbeat", terminalAuth, async (req, res) => {
  await updateTerminalHeartbeat(req.terminal);
  return res.json({ ok: true });
});

router.post("/error", terminalAuth, async (req, res) => {
  const { message, severity } = req.body;
  await reportTerminalError(req.terminal, message, severity);
  return res.json({ ok: true });
});

router.post("/orders/:orderId/accept", terminalAuth, acceptOrder);
router.post("/orders/:orderId/reject", terminalAuth, rejectOrder);

export default router;








