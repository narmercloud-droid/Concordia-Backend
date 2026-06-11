import * as managerService from "../../services/manager/manager.service.js";
import { managerHasPermission } from "../../services/manager/managerPermissions.service.js";
import { wrap, fail } from "../../contracts/api.js";
function branchId(req) {
    return req.managerBranchId;
}
export const getBranch = wrap(async (req) => {
    try {
        return await managerService.getManagerBranch(branchId(req));
    }
    catch (err) {
        throw fail("NOT_FOUND", err?.message ?? "Branch not found");
    }
});
export const getHours = wrap(async (req) => {
    return managerService.getBranchHours(branchId(req));
});
export const updateHours = wrap(async (req) => {
    const hours = req.body?.hours;
    if (!Array.isArray(hours)) {
        throw fail("INVALID_INPUT", "hours array is required");
    }
    return managerService.updateBranchHours(branchId(req), hours);
});
export const updateBranchVisibility = wrap(async (req) => {
    const user = req.user;
    if (user?.role !== "admin") {
        throw fail("FORBIDDEN", "Only super admin can change branch visibility");
    }
    const status = req.body?.status;
    if (!["live", "coming_soon"].includes(status)) {
        throw fail("INVALID_INPUT", "status must be live or coming_soon");
    }
    try {
        return await managerService.updateBranchVisibility(branchId(req), status);
    }
    catch (err) {
        throw fail("INVALID_INPUT", err?.message ?? "Could not update branch status");
    }
});
export const getConfig = wrap(async (req) => {
    return managerService.getBranchConfig(branchId(req));
});
export const updateDeliveryAreas = wrap(async (req) => {
    const areas = req.body?.deliveryAreas;
    if (!Array.isArray(areas)) {
        throw fail("INVALID_INPUT", "deliveryAreas array is required");
    }
    return managerService.updateDeliveryAreas(branchId(req), areas);
});
export const updateDeliverySettings = wrap(async (req) => {
    const { deliveryMode, freeDeliveryAtMinimum, deliveryAreas, deliveryRadiusZones } = req.body ?? {};
    if (deliveryMode != null &&
        !["postcodes", "radius", "both"].includes(deliveryMode)) {
        throw fail("INVALID_INPUT", "deliveryMode must be postcodes, radius, or both");
    }
    if (deliveryAreas != null && !Array.isArray(deliveryAreas)) {
        throw fail("INVALID_INPUT", "deliveryAreas must be an array");
    }
    if (deliveryRadiusZones != null && !Array.isArray(deliveryRadiusZones)) {
        throw fail("INVALID_INPUT", "deliveryRadiusZones must be an array");
    }
    return managerService.updateDeliverySettings(branchId(req), {
        deliveryMode,
        freeDeliveryAtMinimum,
        deliveryAreas,
        deliveryRadiusZones
    });
});
export const getMenu = wrap(async (req) => {
    return managerService.getBranchMenuForManager(branchId(req));
});
export const updateVariantGroup = wrap(async (req) => {
    const groupId = req.params.groupId;
    if (!groupId)
        throw fail("INVALID_INPUT", "group id is required");
    if (typeof req.body?.includedChoice !== "boolean") {
        throw fail("INVALID_INPUT", "includedChoice boolean is required");
    }
    try {
        const updated = await managerService.updateVariantGroupIncludedChoice(branchId(req), groupId, req.body.includedChoice);
        return {
            id: updated.id,
            name: updated.name,
            includedChoice: updated.includedChoice
        };
    }
    catch (err) {
        throw fail("NOT_FOUND", err?.message ?? "Variant group not found");
    }
});
export const updateMenuItem = wrap(async (req) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
        throw fail("INVALID_INPUT", "Invalid item id");
    const user = req.user;
    if (req.body?.price != null) {
        const allowed = await managerHasPermission(user?.role, "menu_edit_prices");
        if (!allowed)
            throw fail("FORBIDDEN", "Cannot edit menu prices");
    }
    if (req.body?.isAvailable != null) {
        const allowed = await managerHasPermission(user?.role, "menu_edit_availability");
        if (!allowed)
            throw fail("FORBIDDEN", "Cannot edit item availability");
    }
    try {
        const updated = await managerService.updateBranchMenuItem(branchId(req), id, {
            price: req.body?.price != null ? Number(req.body.price) : undefined,
            isAvailable: req.body?.isAvailable
        });
        return {
            branchMenuItemId: updated.id,
            menuItemId: updated.menuItemId,
            name: updated.menuItem.name,
            price: updated.price ?? updated.menuItem.basePrice ?? 0,
            isAvailable: updated.isAvailable
        };
    }
    catch (err) {
        throw fail("NOT_FOUND", err?.message ?? "Item not found");
    }
});
export const getOrders = wrap(async (req) => {
    const limit = Number(req.query.limit ?? 50);
    const orders = await managerService.getBranchOrders(branchId(req), limit);
    return orders.map((o) => ({
        id: o.id,
        status: o.status,
        courierStatus: o.courierStatus,
        fulfillmentType: o.fulfillmentType,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        deliveryAddress: o.deliveryAddress,
        orderTotal: o.orderTotal,
        deliveryFee: o.deliveryFee,
        scheduledFor: o.scheduledFor,
        createdAt: o.createdAt,
        items: o.items.map((i) => ({
            name: i.item?.name,
            quantity: i.quantity,
            price: i.price
        }))
    }));
});
export const getDashboard = wrap(async (req) => {
    return managerService.getBranchDashboard(branchId(req));
});
export const getPromotions = wrap(async (req) => {
    return managerService.getBranchPromotions(branchId(req));
});
export const updatePromotions = wrap(async (req) => {
    const { freeDrinkMinOrder, freeDrinkMessage, websiteDiscountEnabled } = req.body ?? {};
    return managerService.updateBranchPromotions(branchId(req), {
        freeDrinkMinOrder: freeDrinkMinOrder != null ? Number(freeDrinkMinOrder) : undefined,
        freeDrinkMessage,
        websiteDiscountEnabled
    });
});
