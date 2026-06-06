import express from "express";
const { Router } = express;
import { TerminalStatusController } from "../../controllers/admin/terminalStatus.controller.ts";
import { validate } from "../../middleware/validate.ts";
import { getTerminalStatusSchema } from "../../schemas/adminTerminalSchemas.ts";

const router = Router();

router.get("/terminals/status", validate(getTerminalStatusSchema), TerminalStatusController.getTerminalStatus);

export default router;






