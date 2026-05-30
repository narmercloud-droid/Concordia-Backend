import { prisma } from "../../prisma/client.js";
import { success } from "../controllerHelper.js";

export const listTerminals = async (req, res) => {
  const terminals = await prisma.terminalStatus.findMany();
  return success(res, terminals);
};

export const listTerminalErrors = async (req, res) => {
  const errors = await prisma.terminalError.findMany({
    orderBy: { createdAt: "desc" },
    take: 200
  });
  return success(res, errors);
};

