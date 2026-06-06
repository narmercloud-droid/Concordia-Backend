import type { Request  } from "express";
import { TerminalService } from "../../services/terminal/terminal.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class TerminalController {
  static activate = wrap(async (req: Request) => {
    const { branchId } = req.body;

    if (!branchId) throw fail('INVALID_INPUT', 'branchId is required');

    const activationToken = await TerminalService.activateTerminal(branchId);
    return { token: activationToken };
  });

  static register = wrap(async (req: Request) => {
    const { activation_token, terminal_name } = req.body;

    if (!activation_token || !terminal_name) throw fail('INVALID_INPUT', 'activation_token and terminal_name are required');

    try {
      const terminal = await TerminalService.registerTerminal(activation_token, terminal_name);
      return { terminal_id: terminal.id, branchId: terminal.branchId };
    } catch (err: any) {
      if (err.message === 'Branch not found') throw fail('NOT_FOUND', err.message);
      if (err.message === 'Terminal has already been registered') throw fail('CONFLICT', err.message);
      throw fail('INTERNAL_ERROR', err.message || 'Failed to register terminal');
    }
  });

  static login = wrap(async (req: Request) => {
    const { terminal_token } = req.body;

    if (!terminal_token) throw fail('INVALID_INPUT', 'terminal_token is required');

    try {
      const terminal = await TerminalService.loginTerminal(terminal_token);
      return { terminal_id: terminal.id, branchId: terminal.branchId };
    } catch (err: any) {
      throw fail('UNAUTHORIZED', err.message || 'Failed to login terminal');
    }
  });

  static acknowledgeOrder = wrap(async (req: Request) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    const order = await TerminalService.acknowledgeOrder(order_id, terminal_id);
    return order;
  });

  static assignOrder = wrap(async (req: Request) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    await TerminalService.assignOrder(order_id, terminal_id);
    return { status: 'assigned' };
  });

  static acceptOrder = wrap(async (req: Request) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    const order = await TerminalService.acceptOrder(order_id, terminal_id);
    return order;
  });

  static rejectOrder = wrap(async (req: Request) => {
    const { order_id } = req.params;
    const terminal_id = req.user?.id as string;

    const order = await TerminalService.rejectOrder(order_id, terminal_id);
    return order;
  });

  static heartbeat = wrap(async (req: Request) => {
    const terminal_id = req.user?.id as string;
    await TerminalService.updateHeartbeat(terminal_id);
    return { status: 'ok' };
  });

  static ordersStream = wrap(async () => {
    throw fail('NOT_IMPLEMENTED', 'Not implemented');
  });
}





