import type { Request, Response, NextFunction } from "express";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";
import type { AuthJwtPayload } from "../utils/jwt.ts";

export function optionalCustomerAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next();

  const token = header.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);
    if (decoded.role !== "customer") return next();

    const user = decoded as AuthJwtPayload;
    (req as Request & { user?: AuthJwtPayload; customer?: AuthJwtPayload }).user = user;
    (req as Request & { customer?: AuthJwtPayload }).customer = user;
  } catch {
    // Ignore invalid tokens — guest checkout still works.
  }

  next();
}
