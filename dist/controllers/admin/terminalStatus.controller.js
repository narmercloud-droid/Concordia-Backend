import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
export class TerminalStatusController {
    // -----------------------------------------------------
    // GET TERMINAL STATUS
    // -----------------------------------------------------
    static async getTerminalStatus(_req, res, next) {
        try {
            const status = await TerminalStatusService.getTerminalStatus();
            res.json(status);
            return;
        }
        catch (err) {
            next(err);
        }
    }
}
