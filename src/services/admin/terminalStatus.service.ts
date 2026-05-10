import { prisma } from "../../prisma/client";

export class TerminalStatusService {
  static async getTerminalStatus() {
    const terminals = await prisma.branchTerminal.findMany({
      select: {
        is_online: true,
        status: true,
      },
    });

    const total_terminals = terminals.length;
    const online_terminals = terminals.filter(t => t.is_online).length;
    const offline_terminals = total_terminals - online_terminals;
    const active_terminals = terminals.filter(t => t.status === 'active').length;
    const inactive_terminals = total_terminals - active_terminals;

    return {
      total_terminals,
      online_terminals,
      offline_terminals,
      active_terminals,
      inactive_terminals,
    };
  }
}