var _a;
import { TerminalService } from "../../services/terminal/terminal.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class TerminalController {
}
_a = TerminalController;
TerminalController.activate = wrap(async (req) => {
    const { branchId } = req.body;
    if (!branchId)
        throw fail('INVALID_INPUT', 'branchId is required');
    const activationToken = await TerminalService.activateTerminal(branchId);
    return { token: activationToken };
});
TerminalController.register = wrap(async (req) => {
    const { activation_token, terminal_name } = req.body;
    if (!activation_token || !terminal_name)
        throw fail('INVALID_INPUT', 'activation_token and terminal_name are required');
    try {
        const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
        return { terminal_id: terminal.id, branchId: terminal.branchId };
    }
    catch (err) {
        if (err.message === 'Branch not found')
            throw fail('NOT_FOUND', err.message);
        if (err.message === 'Terminal has already been registered')
            throw fail('CONFLICT', err.message);
        throw fail('INTERNAL_ERROR', err.message || 'Failed to register terminal');
    }
});
TerminalController.login = wrap(async (req) => {
    const { terminal_token } = req.body;
    if (!terminal_token)
        throw fail('INVALID_INPUT', 'terminal_token is required');
    try {
        const terminal = await TerminalService.loginTerminal(terminal_token);
        return { terminal_id: terminal.id, branchId: terminal.branchId };
    }
    catch (err) {
        throw fail('UNAUTHORIZED', err.message || 'Failed to login terminal');
    }
});
TerminalController.acknowledgeOrder = wrap(async (req) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id;
    const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
    return order;
});
TerminalController.assignOrder = wrap(async (req) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id;
    await TerminalService.assignOrder(order_id, terminal_id);
    return { status: 'assigned' };
});
TerminalController.acceptOrder = wrap(async (req) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id;
    const order = await TerminalService.acceptOrder(order_id, terminal_id);
    return order;
});
TerminalController.rejectOrder = wrap(async (req) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id;
    const order = await TerminalService.rejectOrder(order_id, terminal_id);
    return order;
});
TerminalController.heartbeat = wrap(async (req) => {
    const terminal_id = req.user?.id;
    await TerminalService.updateHeartbeat(terminal_id);
    return { status: 'ok' };
});
TerminalController.ordersStream = wrap(async () => {
    throw fail('NOT_IMPLEMENTED', 'Not implemented');
});
