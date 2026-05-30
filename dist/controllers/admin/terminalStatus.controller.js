import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
import { success } from "../controllerHelper.js";
export class TerminalStatusController {
    // -----------------------------------------------------
    // GET TERMINAL STATUS
    // -----------------------------------------------------
    static async getTerminalStatus(_req, res, next) {
        try {
            const status = await TerminalStatusService.getTerminalStatus();
            return success(res, status);
        }
        catch (err) {
            next(err);
        }
    }
}
