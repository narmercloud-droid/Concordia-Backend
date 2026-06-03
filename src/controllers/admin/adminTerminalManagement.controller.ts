import { prisma } from "../../prisma/client.ts";
import crypto from "crypto";
import { wrap } from "../../contracts/api.js";

export const adminListTerminals = wrap(async () => {
  const terminals = await prisma.terminal.findMany({
    include: {
      branch: true
    }
  });
  return terminals;
});

export const adminResetTerminalToken = wrap(async (req) => {
  const { terminalId } = req.params;
  const newToken = crypto.randomUUID();

  const updated = await prisma.terminal.update({
    where: { id: terminalId },
    data: { activation_token: newToken }
  });

  return updated;
});

export const adminAssignTerminalKitchen = wrap(async (req) => {
  const { terminalId } = req.params;
  const { kitchen } = req.body;

  const updated = await prisma.terminalStatus.updateMany({
    where: { terminalId: Number(terminalId) },
    data: { assignedKitchen: kitchen }
  });

  return { ok: true, updated };
});

