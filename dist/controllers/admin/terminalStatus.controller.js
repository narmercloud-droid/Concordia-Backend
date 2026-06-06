var _a;
import { TerminalStatusService } from "../../services/admin/terminalStatus.service.js";
import { wrap } from "../../contracts/api.js";
export class TerminalStatusController {
}
_a = TerminalStatusController;
// -----------------------------------------------------
// GET TERMINAL STATUS
// -----------------------------------------------------
TerminalStatusController.getTerminalStatus = wrap(async (_req) => {
    const status = await TerminalStatusService.getTerminalStatus();
    return status;
});
