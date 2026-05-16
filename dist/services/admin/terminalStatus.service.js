import { prisma } from "../../prisma/client.js";
export class TerminalStatusService {
    static async getTerminalStatus(branchId) {
        const terminals = await prisma.terminal.findMany({
            where: branchId ? { branchId } : {},
            select: {
                isOnline: true,
                lastSeen: true,
            },
        });
        const total_terminals = terminals.length;
        const online_terminals = terminals.filter(t => t.isOnline).length;
        const offline_terminals = total_terminals - online_terminals;
        const active_terminals = terminals.filter(t => t.lastSeen !== null).length;
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
