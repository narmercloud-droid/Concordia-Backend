import { prisma } from "../../prisma/client.ts";

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
  "offers_edit"
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];
export type ManagerPermissions = Record<PermissionKey, boolean>;

/** Edit/action permissions require the corresponding view permission */
export const PERMISSION_DEPENDENCIES: Partial<Record<PermissionKey, PermissionKey>> = {
  menu_edit_prices: "menu_view",
  menu_edit_availability: "menu_view",
  menu_edit_structure: "menu_view",
  hours_edit: "hours_view",
  delivery_edit: "delivery_view",
  customers_export: "customers_view",
  customers_automation: "customers_view",
  offers_edit: "offers_view"
};

export const DEFAULT_MANAGER_PERMISSIONS: ManagerPermissions = {
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
  offers_edit: true
};

function applyPermissionDependencies(permissions: ManagerPermissions): ManagerPermissions {
  const result = { ...permissions };
  for (const [child, parent] of Object.entries(PERMISSION_DEPENDENCIES)) {
    const childKey = child as PermissionKey;
    const parentKey = parent as PermissionKey;
    if (!result[parentKey]) {
      result[childKey] = false;
    }
  }
  return result;
}

function normalizePermissions(raw: unknown): ManagerPermissions {
  const input = (raw ?? {}) as Partial<ManagerPermissions>;
  const result = { ...DEFAULT_MANAGER_PERMISSIONS };
  for (const key of PERMISSION_KEYS) {
    if (typeof input[key] === "boolean") {
      result[key] = input[key]!;
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

export async function updateManagerPermissionPolicy(
  permissions: Partial<ManagerPermissions>,
  updatedBy?: string
) {
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

export async function managerHasPermission(
  role: string | undefined,
  permission: PermissionKey
) {
  if (role === "admin") return true;
  if (role !== "manager") return false;

  const policy = await getManagerPermissionPolicy();
  if (!policy[permission]) return false;

  const dependency = PERMISSION_DEPENDENCIES[permission];
  if (dependency && !policy[dependency]) return false;

  return true;
}
