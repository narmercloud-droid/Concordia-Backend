import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.js";
import { listTerminals, listTerminalErrors } from "../../controllers/admin/adminTerminal.controller.js";
const router = Router();
router.get("/terminals", adminAuth, listTerminals);
router.get("/terminals/errors", adminAuth, listTerminalErrors);
export default router;
