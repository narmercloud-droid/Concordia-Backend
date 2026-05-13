import { Router } from "express";
import { TerminalStatusController } from "../../controllers/admin/terminalStatus.controller.js";
import { validate } from "../../middleware/validate.js";
import { getTerminalStatusSchema } from "../../schemas/adminTerminalSchemas";
const router = Router();
router.get("/terminals/status", validate(getTerminalStatusSchema), TerminalStatusController.getTerminalStatus);
export default router;
