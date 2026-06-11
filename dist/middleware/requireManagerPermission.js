import { managerHasPermission } from "../services/manager/managerPermissions.service.js";
export function requireManagerPermission(permission) {
    return async (req, res, next) => {
        const user = req.user;
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
