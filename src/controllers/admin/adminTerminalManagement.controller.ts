import { prisma } from "../../prisma/client.js";
import crypto from "crypto";
import { success } from "../controllerHelper.js";

export const adminListTerminals = async (req, res) => {
  const terminals = await prisma.terminal.findMany({
    include: {
      branch: true
    }
  });
  return success(res, terminals);
};

export const adminResetTerminalToken = async (req, res) => {
  const { terminalId } = req.params;
  const newToken = crypto.randomUUID();

  const updated = await prisma.terminal.update({
    where: { id: terminalId },
    data: { activation_token: newToken }
  });

  return success(res, updated);
};

export const adminAssignTerminalKitchen = async (req, res) => {
  const { terminalId } = req.params;
  const { kitchen } = req.body;

  const updated = await prisma.terminalStatus.updateMany({
    where: { terminalId: Number(terminalId) },
    data: { assignedKitchen: kitchen }
  });

  return success(res, { ok: true, updated });
};

