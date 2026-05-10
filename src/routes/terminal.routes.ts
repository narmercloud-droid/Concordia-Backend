import { Router } from "express";
import { TerminalController } from "../controllers/terminal/terminal.controller";
import { validateTerminalToken } from "../middleware/terminalAuth";
import { validate } from "../middleware/validate";
import { activateTerminalSchema, registerTerminalSchema, loginTerminalSchema } from "../schemas/terminalSchemas";
import { assignOrderSchema, acceptOrderSchema, rejectOrderSchema } from "../schemas/orderWorkflowSchemas";

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

export default router;
