import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";

export async function validateTerminalToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-terminal-token"] as string;

  if (!token) {
    return res.status(401).json({ error: "Invalid or missing terminal token" });
  }

  try {
    const terminal = await prisma.branchTerminal.findUnique({
      where: { terminal_token: token },
    });

    if (!terminal) {
      return res.status(401).json({ error: "Invalid or missing terminal token" });
    }

    (req as any).terminal = {
      terminal_id: terminal.id,
      branch_id: terminal.branch_id,
    };

    next();
  } catch (error) {
    console.error("Terminal auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}