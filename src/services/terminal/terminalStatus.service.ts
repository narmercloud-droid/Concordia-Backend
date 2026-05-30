import { prisma } from "../../prisma/client.js";

export async function updateTerminalHeartbeat(terminal) {
  return prisma.terminalStatus.upsert({
    where: {
      terminalId_branchId: {
        terminalId: terminal.id,
        branchId: terminal.branchId
      }
    },
    update: {
      online: true,
      lastSeen: new Date()
    },
    create: {
      terminalId: terminal.id,
      branchId: terminal.branchId,
      online: true
    }
  });
}

export async function markTerminalOffline() {
  const cutoff = new Date(Date.now() - 15000);

  await prisma.terminalStatus.updateMany({
    where: {
      lastSeen: { lt: cutoff },
      online: true
    },
    data: { online: false }
  });
}

