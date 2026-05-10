"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalAdminController = void 0;
const terminalAdmin_service_1 = require("../../services/admin/terminalAdmin.service");
class TerminalAdminController {
    // -----------------------------------------------------
    // GET ALL TERMINALS
    // -----------------------------------------------------
    static async getTerminals(_req, res) {
        try {
            const terminals = await terminalAdmin_service_1.TerminalAdminService.getTerminals();
            res.json(terminals);
            return;
        }
        catch (err) {
            res.status(500).json({ error: err.message || "Failed to fetch terminals" });
            return;
        }
    }
}
exports.TerminalAdminController = TerminalAdminController;
