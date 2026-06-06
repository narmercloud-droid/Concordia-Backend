import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { listTerminals, listTerminalErrors } from "../../controllers/admin/adminTerminal.controller.ts";

const router = Router();

router.get("/terminals", adminAuth, listTerminals);
router.get("/terminals/errors", adminAuth, listTerminalErrors);

export default router;

