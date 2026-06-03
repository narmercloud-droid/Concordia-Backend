import type { Request, Response, NextFunction  } from "express";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";
import logger from "../logger.ts";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    logger.warn({ ip: req.ip, path: req.path }, "Unauthorized admin access: missing token");
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);

    if (decoded.role !== "admin" && decoded.role !== "manager") {
      logger.warn({ ip: req.ip, user: decoded?.id, role: decoded?.role, path: req.path }, "Forbidden admin access attempt");
      return res.status(403).json({ error: "Forbidden" });
    }

    (req as any).user = decoded;
    next();
  } catch {
    logger.warn({ ip: req.ip, path: req.path }, "Invalid admin token");
    return res.status(403).json({ error: "Invalid token" });
  }
}





