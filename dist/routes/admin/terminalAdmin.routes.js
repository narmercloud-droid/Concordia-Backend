"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const terminalAdmin_controller_1 = require("../../controllers/admin/terminalAdmin.controller");
const router = (0, express_1.Router)();
router.get("/terminals", terminalAdmin_controller_1.TerminalAdminController.getTerminals);
exports.default = router;
