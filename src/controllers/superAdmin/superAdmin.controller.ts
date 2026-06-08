import type { Request } from "express";
import { wrap, fail } from "../../contracts/api.js";
import {
  getManagerPermissionPolicy,
  updateManagerPermissionPolicy,
  PERMISSION_KEYS
} from "../../services/manager/managerPermissions.service.ts";
import {
  createStaff,
  deleteStaff,
  listStaff,
  updateStaff
} from "../../services/manager/staff.service.ts";
import { prisma } from "../../prisma/client.ts";
import { updateBranchVisibility } from "../../services/manager/manager.service.ts";

export const getPermissions = wrap(async () => {
  const permissions = await getManagerPermissionPolicy();
  return { permissions, keys: PERMISSION_KEYS };
});

export const updatePermissions = wrap(async (req: Request) => {
  const user = (req as any).user;
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

export const createStaffMember = wrap(async (req: Request) => {
  try {
    const created = await createStaff(req.body);
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      branchId: created.branchId
    };
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not create staff");
  }
});

export const updateStaffMember = wrap(async (req: Request) => {
  try {
    const updated = await updateStaff(req.params.id, req.body);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      branchId: updated.branchId
    };
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not update staff");
  }
});

export const removeStaffMember = wrap(async (req: Request) => {
  const user = (req as any).user;
  try {
    return await deleteStaff(req.params.id, user?.id);
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not delete staff");
  }
});

export const listAllBranches = wrap(async () => {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    include: { BranchConfig: true }
  });

  return branches.map((b) => {
    const config = (b.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
    return {
      id: b.id,
      name: b.name,
      status: config.status ?? "live",
      city: config.city ?? null,
      address: config.address ?? null
    };
  });
});

export const updateBranchStatus = wrap(async (req: Request) => {
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
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not update branch status");
  }
});
