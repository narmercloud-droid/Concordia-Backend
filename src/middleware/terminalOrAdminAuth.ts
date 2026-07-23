import type { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client.ts";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";
import logger from "../logger.ts";

/**
 * Accepts either a terminal activation token (x-terminal-token)
 * or an admin/manager Bearer JWT. Used for kitchen lifecycle mutations.
 */
export async function terminalOrAdminAuth(req: Request, res: Response, next: NextFunction) {
  const terminalToken = req.headers["x-terminal-token"] as string | undefined;
  if (terminalToken) {
    try {
      const terminal = await prisma.terminal.findUnique({
        where: { activation_token: terminalToken }
      });
      if (!terminal) {
        return res.status(401).json({ error: "Invalid or missing terminal token" });
      }
      req.user = {
        id: terminal.id,
        role: "terminal",
        branchId: terminal.branchId
      };
      req.terminal = terminal;
      return next();
    } catch (error) {
      logger.error({ err: error }, "terminalOrAdminAuth terminal lookup failed");
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing terminal or admin credentials" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);

    if (decoded.role !== "admin" && decoded.role !== "manager") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = decoded;
    return next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}
