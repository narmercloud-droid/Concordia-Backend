import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { validateJwtPayload, verifyToken, JwtPayload } from "../utils/jwt.js";

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Missing token" });

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    validateJwtPayload(decoded);

    req.user = decoded as AuthenticatedRequest["user"];
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
