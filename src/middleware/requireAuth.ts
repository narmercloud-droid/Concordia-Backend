import { Request, Response, NextFunction } from "express";
import { validateJwtPayload, verifyToken, JwtPayload } from "../utils/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Missing token" });

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    validateJwtPayload(decoded);

    req.user = decoded as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
