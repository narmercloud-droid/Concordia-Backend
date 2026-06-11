import { prisma } from "../../prisma/client.js";
export const PERMISSION_KEYS = [
    "dashboard",
    "orders",
    "menu_view",
    "menu_edit_prices",
    "menu_edit_availability",
    "menu_edit_structure",
    "hours_view",
    "hours_edit",
    "delivery_view",
    "delivery_edit",
    "customers_view",
    "customers_export",
    "customers_automation",
    "offers_view",
    "offers_edit",
    "reviews_view"
];
/** Edit/action permissions require the corresponding view permission */
export const PERMISSION_DEPENDENCIES = {
    menu_edit_prices: "menu_view",
    menu_edit_availability: "menu_view",
    menu_edit_structure: "menu_view",
    hours_edit: "hours_view",
    delivery_edit: "delivery_view",
    customers_export: "customers_view",
    customers_automation: "customers_view",
    offers_edit: "offers_view"
};
export const DEFAULT_MANAGER_PERMISSIONS = {
    dashboard: true,
    orders: true,
    menu_view: true,
    menu_edit_prices: true,
    menu_edit_availability: true,
    menu_edit_structure: true,
    hours_view: true,
    hours_edit: true,
    delivery_view: true,
    delivery_edit: true,
    customers_view: true,
    customers_export: false,
    customers_automation: false,
    offers_view: true,
    offers_edit: true,
    reviews_view: true
};
function applyPermissionDependencies(permissions) {
    const result = { ...permissions };
    for (const [child, parent] of Object.entries(PERMISSION_DEPENDENCIES)) {
        const childKey = child;
        const parentKey = parent;
        if (!result[parentKey]) {
            result[childKey] = false;
        }
    }
    return result;
}
function normalizePermissions(raw) {
    const input = (raw ?? {});
    const result = { ...DEFAULT_MANAGER_PERMISSIONS };
    for (const key of PERMISSION_KEYS) {
        if (typeof input[key] === "boolean") {
            result[key] = input[key];
        }
    }
    return applyPermissionDependencies(result);
}
export async function getManagerPermissionPolicy() {
    const row = await prisma.managerPermissionPolicy.findUnique({
        where: { id: "default" }
    });
    if (!row) {
        return DEFAULT_MANAGER_PERMISSIONS;
    }
    return normalizePermissions(row.permissions);
}
export async function updateManagerPermissionPolicy(permissions, updatedBy) {
    const current = await getManagerPermissionPolicy();
    const merged = normalizePermissions({ ...current, ...permissions });
    await prisma.managerPermissionPolicy.upsert({
        where: { id: "default" },
        update: {
            permissions: merged,
            updatedBy: updatedBy ?? null
        },
        create: {
            id: "default",
            permissions: merged,
            updatedBy: updatedBy ?? null
        }
    });
    return merged;
}
export async function managerHasPermission(role, permission) {
    if (role === "admin")
        return true;
    if (role !== "manager")
        return false;
    const policy = await getManagerPermissionPolicy();
    if (!policy[permission])
        return false;
    const dependency = PERMISSION_DEPENDENCIES[permission];
    if (dependency && !policy[dependency])
        return false;
    return true;
}
