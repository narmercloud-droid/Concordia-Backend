import type { Request, Response, NextFunction  } from "express";
import { validateJwtPayload, verifyToken } from "../utils/jwt.ts";
import type { AuthJwtPayload } from "../utils/jwt.ts";

function attachCustomer(req: Request, decoded: AuthJwtPayload) {
  (req as any).user = decoded;
  (req as any).customer = decoded;
}

export function customerAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);

    if (decoded.role !== "customer") return res.status(403).json({ error: "Forbidden" });

    attachCustomer(req, decoded as AuthJwtPayload);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/** Parses customer JWT when present; continues as guest when missing or invalid. */
export function optionalCustomerAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next();

  const token = header.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    validateJwtPayload(decoded);
    if (decoded.role === "customer") {
      attachCustomer(req, decoded as AuthJwtPayload);
    }
  } catch {
    // ignore invalid optional auth
  }
  next();
}





