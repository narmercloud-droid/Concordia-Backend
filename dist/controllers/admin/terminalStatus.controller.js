import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
import { success, fail } from "../controllerHelper.js";
export class TerminalStatusController {
    static async getTerminalStatus(_req, res, next) {
        try {
            const status = await TerminalStatusService.getTerminalStatus();
            return success(res, status, "Terminal status fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
