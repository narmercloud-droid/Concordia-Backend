import type { Request } from "express";
import * as managerService from "../../services/manager/manager.service.ts";
import { wrap, fail } from "../../contracts/api.js";

function branchId(req: Request) {
  return (req as any).managerBranchId as string;
}

export const getBranch = wrap(async (req: Request) => {
  try {
    return await managerService.getManagerBranch(branchId(req));
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Branch not found");
  }
});

export const getHours = wrap(async (req: Request) => {
  return managerService.getBranchHours(branchId(req));
});

export const updateHours = wrap(async (req: Request) => {
  const hours = req.body?.hours;
  if (!Array.isArray(hours)) {
    throw fail("INVALID_INPUT", "hours array is required");
  }
  return managerService.updateBranchHours(branchId(req), hours);
});

export const getConfig = wrap(async (req: Request) => {
  return managerService.getBranchConfig(branchId(req));
});

export const updateDeliveryAreas = wrap(async (req: Request) => {
  const areas = req.body?.deliveryAreas;
  if (!Array.isArray(areas)) {
    throw fail("INVALID_INPUT", "deliveryAreas array is required");
  }
  return managerService.updateDeliveryAreas(branchId(req), areas);
});

export const updateDeliverySettings = wrap(async (req: Request) => {
  const { deliveryMode, freeDeliveryAtMinimum, deliveryAreas, deliveryRadiusZones } =
    req.body ?? {};

  if (
    deliveryMode != null &&
    !["postcodes", "radius", "both"].includes(deliveryMode)
  ) {
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

export const getMenu = wrap(async (req: Request) => {
  return managerService.getBranchMenuForManager(branchId(req));
});

export const updateMenuItem = wrap(async (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) throw fail("INVALID_INPUT", "Invalid item id");

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
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Item not found");
  }
});

export const getOrders = wrap(async (req: Request) => {
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

export const getDashboard = wrap(async (req: Request) => {
  return managerService.getBranchDashboard(branchId(req));
});
