var _a;
import { TerminalAdminService } from "../../services/admin/terminalAdmin.service.js";
import { wrap } from "../../contracts/api.js";
export class TerminalAdminController {
}
_a = TerminalAdminController;
// -----------------------------------------------------
// GET ALL TERMINALS
// -----------------------------------------------------
TerminalAdminController.getAllTerminals = wrap(async (_req) => {
    const terminals = await TerminalAdminService.getAllTerminals();
    return terminals;
});
// -----------------------------------------------------
// GET TERMINAL ACTIVITY
// -----------------------------------------------------
TerminalAdminController.getTerminalActivity = wrap(async (_req) => {
    const activity = await TerminalAdminService.getTerminalActivity();
    return activity;
});
