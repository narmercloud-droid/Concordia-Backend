import { prisma } from "../../prisma/client.ts";

export class TerminalAdminService {
  static async getAllTerminals() {
    return await prisma.terminal.findMany({
      select: {
        id: true,
        name: true,
        branchId: true,
        isOnline: true,
        lastSeen: true,
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
    const terminals = await prisma.terminal.findMany({
      select: {
        id: true,
        name: true,
        branchId: true,
        lastSeen: true,
        isOnline: true,
      },
      orderBy: { lastSeen: "desc" },
    });

    return terminals.map((terminal) => ({
      terminal_id: terminal.id,
      name: terminal.name,
      branch_id: terminal.branchId,
      lastSeen: terminal.lastSeen,
      isOnline: terminal.isOnline,
    }));
  }
}




