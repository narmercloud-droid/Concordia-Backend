import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import {
  adminListTerminals,
  adminResetTerminalToken,
  adminAssignTerminalKitchen
} from "../../controllers/admin/adminTerminalManagement.controller.ts";

import {
  getBranchSettings,
  updateBranchSettings
} from "../../controllers/admin/adminBranchSettings.controller.ts";

const router = Router();

router.get("/terminals", adminAuth, adminListTerminals);
router.post("/terminals/:terminalId/reset-token", adminAuth, adminResetTerminalToken);
router.post("/terminals/:terminalId/assign-kitchen", adminAuth, adminAssignTerminalKitchen);

router.get("/branches/:branchId/settings", adminAuth, getBranchSettings);
router.post("/branches/:branchId/settings", adminAuth, updateBranchSettings);

export default router;

