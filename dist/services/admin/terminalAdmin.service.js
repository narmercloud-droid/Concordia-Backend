"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalAdminService = void 0;
const client_1 = require("../../prisma/client");
class TerminalAdminService {
    static async getTerminals() {
        return await client_1.prisma.branchTerminal.findMany({
            select: {
                id: true,
                name: true,
                branch_id: true,
                is_online: true,
                last_seen: true,
            },
            orderBy: { createdAt: "asc" },
        });
    }
}
exports.TerminalAdminService = TerminalAdminService;
