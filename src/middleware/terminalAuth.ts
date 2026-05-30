import type { Request, Response, NextFunction  } from "express";
import { prisma } from "../prisma/client.js";

export async function validateTerminalToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-terminal-token"] as string;

  if (!token) {
    return res.status(401).json({ error: "Invalid or missing terminal token" });
  }

  try {
    const terminal = await prisma.terminal.findUnique({
      where: { activation_token: token },
    });

    if (!terminal) {
      return res.status(401).json({ error: "Invalid or missing terminal token" });
    }

    req.user = {
      id: terminal.id,
      role: "terminal",
      branchId: terminal.branchId,
    };

    next();
  } catch (error) {
    console.error("Terminal auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const terminalAuth = async (req, res, next) => {
  try {
    const token = req.headers["x-terminal-token"];
    const terminalId = req.headers["x-terminal-id"];

    if (!token || !terminalId) {
      return res.status(401).json({ error: "Missing terminal credentials" });
    }

    const terminal = await prisma.terminal.findFirst({
      where: { id: terminalId as string, activation_token: token as string }
    });

    if (!terminal) {
      return res.status(401).json({ error: "Invalid terminal credentials" });
    }

    req.terminal = terminal;
    next();
  } catch (err) {
    next(err);
  }
};





