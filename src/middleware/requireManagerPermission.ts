import type { Request, Response, NextFunction } from "express";
import {
  managerHasPermission,
  type PermissionKey
} from "../services/manager/managerPermissions.service.ts";

export function requireManagerPermission(permission: PermissionKey) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const allowed = await managerHasPermission(user?.role, permission);

    if (!allowed) {
      return res.status(403).json({
        error: "You do not have permission for this action",
        permission
      });
    }

    next();
  };
}
