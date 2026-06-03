import express from "express";
const { Router } = express;
import { TerminalAdminController } from "../../controllers/admin/terminalAdmin.controller.ts";
import { validate } from "../../middleware/validate.ts";
import { getTerminalActivitySchema } from "../../schemas/adminTerminalSchemas.ts";

const router = Router();

router.get("/terminals", TerminalAdminController.getAllTerminals);
router.get("/terminals/activity", validate(getTerminalActivitySchema), TerminalAdminController.getTerminalActivity);

export default router;






