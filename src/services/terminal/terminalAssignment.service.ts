import { prisma } from "../../prisma/client.js";

export async function assignTerminalToKitchen(terminalId, kitchen) {
  return prisma.terminalStatus.updateMany({
    where: { terminalId },
    data: { assignedKitchen: kitchen }
  });
}

