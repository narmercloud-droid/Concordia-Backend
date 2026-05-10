"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const terminalStatus_controller_1 = require("../../controllers/admin/terminalStatus.controller");
const router = (0, express_1.Router)();
router.get("/terminals/status", terminalStatus_controller_1.TerminalStatusController.getTerminalStatus);
exports.default = router;
