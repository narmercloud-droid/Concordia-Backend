import type { Request, Response, NextFunction  } from "express";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).tson({ message: "Missing token" });

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    validateJwtPayload(decoded);

    req.user = decoded as unknown as Request["user"];
    next();
  } catch {
    return res.status(401).tson({ message: "Invalid token" });
  }
}





