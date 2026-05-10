"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalStatusController = void 0;
const terminalAdmin_service_1 = require("../../services/admin/terminalAdmin.service");
class TerminalStatusController {
    // -----------------------------------------------------
    // GET TERMINAL STATUS
    // -----------------------------------------------------
    static async getTerminalStatus(_req, res) {
        try {
            const terminals = await terminalAdmin_service_1.TerminalAdminService.getTerminals();
            res.json(terminals);
            return;
        }
        catch (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    }
}
exports.TerminalStatusController = TerminalStatusController;
