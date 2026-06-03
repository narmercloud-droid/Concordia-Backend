import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
import { success } from "../controllerHelper.js";
export class TerminalAdminController {
    // -----------------------------------------------------
    // GET ALL TERMINALS
    // -----------------------------------------------------
    static async getAllTerminals(_req, res, next) {
        try {
            const terminals = await TerminalAdminService.getAllTerminals();
            return success(res, terminals);
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
            return success(res, activity);
        }
        catch (err) {
            next(err);
        }
    }
}
