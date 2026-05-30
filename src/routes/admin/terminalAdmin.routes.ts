import { Router } from "express";
import { TerminalAdminController } from "../../controllers/admin/terminalAdmin.controller.js";
import { validate } from "../../middleware/validate.js";
import { getTerminalActivitySchema } from "../../schemas/adminTerminalSchemas.js";

const router = Router();

router.get("/terminals", TerminalAdminController.getAllTerminals);
router.get("/terminals/activity", validate(getTerminalActivitySchema), TerminalAdminController.getTerminalActivity);

export default router;






