import type { Request, Response, NextFunction  } from "express";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";
import type { AuthJwtPayload } from "../utils/jwt.ts";

export function customerAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);

    if (decoded.role !== "customer") return res.status(403).json({ error: "Forbidden" });

    const user = decoded as AuthJwtPayload;
    (req as any).user = user;
    (req as any).customer = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}





