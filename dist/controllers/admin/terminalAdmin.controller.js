import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
export class TerminalAdminController {
    // -----------------------------------------------------
    // GET ALL TERMINALS
    // -----------------------------------------------------
    static async getAllTerminals(_req, res, next) {
        try {
            const terminals = await TerminalAdminService.getAllTerminals();
            res.json(terminals);
            return;
        }
        catch (err) {
            next(err);
        }
    }
    // -----------------------------------------------------
    // GET TERMINAL ACTIVITY
    // -----------------------------------------------------
    static async getTerminalActivity(_req, res, next) {
        try {
            const activity = await TerminalAdminService.getTerminalActivity();
            res.json(activity);
            return;
        }
        catch (err) {
            next(err);
        }
    }
}
