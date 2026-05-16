import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
import { success, fail } from "../controllerHelper.js";
export class TerminalAdminController {
    static async getAllTerminals(_req, res, next) {
        try {
            const terminals = await TerminalAdminService.getAllTerminals();
            return success(res, terminals, "Terminals listed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
    static async getTerminalActivity(_req, res, next) {
        try {
            const activity = await TerminalAdminService.getTerminalActivity();
            return success(res, activity, "Terminal activity fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
