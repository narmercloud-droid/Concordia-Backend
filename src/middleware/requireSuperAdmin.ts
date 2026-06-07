import type { Request, Response, NextFunction } from "express";

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user?.role !== "admin") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
}
