import { prisma } from "../../prisma/client.ts";

export async function reportTerminalError(terminal, message, severity = 1) {
  return prisma.terminalError.create({
    data: {
      terminalId: terminal.id,
      branchId: terminal.branchId,
      message,
      severity
    }
  });
}

