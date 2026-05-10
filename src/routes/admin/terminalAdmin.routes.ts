import { Router } from "express";
import { TerminalAdminController } from "../../controllers/admin/terminalAdmin.controller";
import { validate } from "../../middleware/validate";
import { getTerminalActivitySchema } from "../../schemas/adminTerminalSchemas";

const router = Router();

router.get("/terminals", TerminalAdminController.getAllTerminals);
router.get("/terminals/activity", validate(getTerminalActivitySchema), TerminalAdminController.getTerminalActivity);

export default router;