import { prisma } from "../../prisma/client.js";
export class TerminalAdminService {
    static async getAllTerminals() {
        return await prisma.branchTerminal.findMany({
            select: {
                id: true,
                name: true,
                branch_id: true,
                status: true,
                is_online: true,
                last_seen: true,
                terminal_token: true,
                createdAt: true,
                branch: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });
    }
    static async getTerminalActivity() {
        const terminals = await prisma.branchTerminal.findMany({
            select: {
                id: true,
                name: true,
                branch_id: true,
                last_seen: true,
                is_online: true,
                orders: {
                    select: {
                        order_id: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
            orderBy: { last_seen: "desc" },
        });
        return terminals.map(terminal => ({
            terminal_id: terminal.id,
            name: terminal.name,
            branch_id: terminal.branch_id,
            last_seen: terminal.last_seen,
            is_online: terminal.is_online,
            recent_orders: terminal.orders,
        }));
    }
}
