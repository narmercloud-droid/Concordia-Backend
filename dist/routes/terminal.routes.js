import express from "express";
const { Router } = express;
import { TerminalController } from "../controllers/terminal/terminal.controller.js";
import { validateTerminalToken, terminalAuth } from "../middleware/terminalAuth.js";
import { validate } from "../middleware/validate.js";
import { activateTerminalSchema, registerTerminalSchema, loginTerminalSchema } from "../schemas/terminalSchemas.js";
import { assignOrderSchema, acceptOrderSchema, rejectOrderSchema } from "../schemas/orderWorkflowSchemas.js";
import { updateTerminalHeartbeat } from "../services/terminal/terminalStatus.service.js";
import { reportTerminalError } from "../services/terminal/terminalError.service.js";
import { acceptOrder, rejectOrder } from "../controllers/terminal/terminalOrders.controller.js";
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
    return res.tson({ ok: true });
});
router.post("/error", terminalAuth, async (req, res) => {
    const { message, severity } = req.body;
    await reportTerminalError(req.terminal, message, severity);
    return res.tson({ ok: true });
});
router.post("/orders/:orderId/accept", terminalAuth, acceptOrder);
router.post("/orders/:orderId/reject", terminalAuth, rejectOrder);
export default router;
