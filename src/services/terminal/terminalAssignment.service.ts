import { prisma } from "../../prisma/client.ts";

export async function assignTerminalToKitchen(terminalId, kitchen) {
  return prisma.terminalStatus.updateMany({
    where: { terminalId },
    data: { assignedKitchen: kitchen }
  });
}

