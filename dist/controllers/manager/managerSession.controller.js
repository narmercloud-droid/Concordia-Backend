import { wrap } from "../../contracts/api.js";
import { getManagerPermissionPolicy } from "../../services/manager/managerPermissions.service.js";
export const getSession = wrap(async (req) => {
    const user = req.user;
    const permissions = await getManagerPermissionPolicy();
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            branchId: user.branchId ?? null
        },
        permissions: user.role === "admin" ? null : permissions,
        isSuperAdmin: user.role === "admin"
    };
});
