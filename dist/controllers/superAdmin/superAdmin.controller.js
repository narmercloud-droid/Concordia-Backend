import { wrap, fail } from "../../contracts/api.js";
import { getManagerPermissionPolicy, updateManagerPermissionPolicy, PERMISSION_KEYS } from "../../services/manager/managerPermissions.service.js";
import { createStaff, deleteStaff, listStaff, updateStaff } from "../../services/manager/staff.service.js";
import { prisma } from "../../prisma/client.js";
import { updateBranchVisibility } from "../../services/manager/manager.service.js";
import { getAggregatedPlatformSettings, getBranchSettingsDetail, updateBranchSettingsDetail, updateGlobalNotificationSettings, updateLoyaltySettings, updatePlatformConfig } from "../../services/platform/platformSettings.service.js";
export const getPermissions = wrap(async () => {
    const permissions = await getManagerPermissionPolicy();
    return { permissions, keys: PERMISSION_KEYS };
});
export const updatePermissions = wrap(async (req) => {
    const user = req.user;
    const input = req.body?.permissions;
    if (!input || typeof input !== "object") {
        throw fail("INVALID_INPUT", "permissions object is required");
    }
    const permissions = await updateManagerPermissionPolicy(input, user?.id);
    return { permissions };
});
export const getStaffList = wrap(async () => {
    const staff = await listStaff();
    return { staff };
});
export const createStaffMember = wrap(async (req) => {
    try {
        const created = await createStaff(req.body);
        return {
            id: created.id,
            name: created.name,
            email: created.email,
            role: created.role,
            branchId: created.branchId
        };
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not create staff");
    }
});
export const updateStaffMember = wrap(async (req) => {
    try {
        const updated = await updateStaff(req.params.id, req.body);
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            branchId: updated.branchId
        };
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not update staff");
    }
});
export const removeStaffMember = wrap(async (req) => {
    const user = req.user;
    try {
        return await deleteStaff(req.params.id, user?.id);
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not delete staff");
    }
});
export const listAllBranches = wrap(async () => {
    const branches = await prisma.branch.findMany({
        orderBy: { name: "asc" },
        include: { BranchConfig: true }
    });
    return branches.map((b) => {
        const config = (b.BranchConfig?.configJson ?? {});
        return {
            id: b.id,
            name: b.name,
            status: config.status ?? "live",
            city: config.city ?? null,
            address: config.address ?? null
        };
    });
});
export const updateBranchStatus = wrap(async (req) => {
    const branchId = req.params.branchId;
    const status = req.body?.status;
    if (!branchId || !["live", "coming_soon"].includes(status)) {
        throw fail("INVALID_INPUT", "status must be live or coming_soon");
    }
    try {
        const branch = await updateBranchVisibility(branchId, status);
        return {
            id: branch.id,
            name: branch.name,
            status: branch.status,
            city: branch.city,
            address: branch.address
        };
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not update branch status");
    }
});
export const getPlatformSettings = wrap(async () => {
    return await getAggregatedPlatformSettings();
});
export const updatePlatformSettings = wrap(async (req) => {
    const body = req.body ?? {};
    const result = {};
    if (body.platform) {
        result.platform = await updatePlatformConfig(body.platform);
    }
    if (body.notifications) {
        result.notifications = await updateGlobalNotificationSettings(body.notifications);
    }
    if (body.loyalty) {
        result.loyalty = await updateLoyaltySettings(body.loyalty);
    }
    if (body.permissions) {
        const permissions = await updateManagerPermissionPolicy(body.permissions, req.user?.id);
        result.permissions = permissions;
    }
    return { ...result, ...(await getAggregatedPlatformSettings()) };
});
export const getBranchSettings = wrap(async (req) => {
    const branchId = req.params.branchId;
    if (!branchId)
        throw fail("INVALID_INPUT", "branchId is required");
    try {
        return await getBranchSettingsDetail(branchId);
    }
    catch (err) {
        throw fail("NOT_FOUND", err?.message ?? "Branch not found");
    }
});
export const updateBranchSettings = wrap(async (req) => {
    const branchId = req.params.branchId;
    if (!branchId)
        throw fail("INVALID_INPUT", "branchId is required");
    try {
        return await updateBranchSettingsDetail(branchId, req.body ?? {});
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not update branch settings");
    }
});
