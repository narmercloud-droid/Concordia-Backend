import express from "express";
const { Router } = express;
import { adminAuth } from "../../middleware/adminAuth.ts";
import { listFleet, setPolicy, setFirmware, sendCommand } from "../../controllers/admin/adminPrinterFleet.controller.ts";

const router = Router();

router.get("/fleet", adminAuth, listFleet);
router.post("/fleet/policy/:printerId", adminAuth, setPolicy);
router.post("/fleet/firmware/:printerId", adminAuth, setFirmware);
router.post("/fleet/command/:printerId/:command", adminAuth, sendCommand);

export default router;

