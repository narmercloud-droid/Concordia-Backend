import type { Request } from "express";
import { wrap, fail } from "../../contracts/api.js";
import { managerHasPermission } from "../../services/manager/managerPermissions.service.ts";
import * as menuCrud from "../../services/manager/managerMenuCrud.service.ts";
import {
  storeMenuItemImage,
  type UploadedImageFile
} from "../../services/upload/menuImageStorage.service.ts";

function branchId(req: Request) {
  return (req as any).managerBranchId as string;
}

async function requireStructureEdit(req: Request) {
  const user = (req as any).user;
  const allowed = await managerHasPermission(user?.role, "menu_edit_structure");
  if (!allowed) throw fail("FORBIDDEN", "Cannot edit menu structure");
}

export const getMenuItemDetail = wrap(async (req: Request) => {
  const menuItemId = Number(req.params.menuItemId);
  if (!Number.isFinite(menuItemId)) throw fail("INVALID_INPUT", "Invalid menu item id");
  try {
    return await menuCrud.getManagerMenuItemDetail(branchId(req), menuItemId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Item not found");
  }
});

export const createCategory = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const name = String(req.body?.name ?? "").trim();
  if (!name) throw fail("INVALID_INPUT", "Category name is required");
  try {
    return await menuCrud.createBranchCategory(branchId(req), {
      name,
      description: req.body?.description,
      sortOrder: req.body?.sortOrder != null ? Number(req.body.sortOrder) : undefined
    });
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not create category");
  }
});

export const updateCategory = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const categoryId = Number(req.params.id);
  if (!Number.isFinite(categoryId)) throw fail("INVALID_INPUT", "Invalid category id");
  try {
    return await menuCrud.updateBranchCategory(branchId(req), categoryId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Category not found");
  }
});

export const deleteCategory = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const categoryId = Number(req.params.id);
  if (!Number.isFinite(categoryId)) throw fail("INVALID_INPUT", "Invalid category id");
  try {
    return await menuCrud.deleteBranchCategory(branchId(req), categoryId);
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not delete category");
  }
});

export const createMenuItem = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const { name, categoryId, price } = req.body ?? {};
  if (!name?.trim()) throw fail("INVALID_INPUT", "Item name is required");
  if (!Number.isFinite(Number(categoryId))) throw fail("INVALID_INPUT", "categoryId is required");
  if (!Number.isFinite(Number(price))) throw fail("INVALID_INPUT", "price is required");
  try {
    const created = await menuCrud.createBranchMenuItem(branchId(req), {
      categoryId: Number(categoryId),
      name: String(name),
      description: req.body?.description,
      price: Number(price),
      kitchen: req.body?.kitchen,
      itemNumber: req.body?.itemNumber,
      sortOrder: req.body?.sortOrder != null ? Number(req.body.sortOrder) : undefined,
      isAvailable: req.body?.isAvailable
    });
    return {
      branchMenuItemId: created.id,
      menuItemId: created.menuItemId,
      name: created.menuItem.name,
      price: created.price ?? created.menuItem.basePrice ?? 0,
      isAvailable: created.isAvailable
    };
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not create item");
  }
});

export const updateMenuItemFull = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) throw fail("INVALID_INPUT", "Invalid item id");
  try {
    const updated = await menuCrud.updateBranchMenuItemFull(branchId(req), id, req.body ?? {});
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

export const uploadMenuItemImage = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const branchMenuItemId = Number(req.params.branchMenuItemId);
  if (!Number.isFinite(branchMenuItemId)) throw fail("INVALID_INPUT", "Invalid item id");

  const file = (req as any).file as UploadedImageFile | undefined;
  if (!file) throw fail("INVALID_INPUT", "Image file is required");

  const bid = branchId(req);
  let menuItemId: number;
  try {
    menuItemId = await menuCrud.getBranchMenuItemMenuItemId(bid, branchMenuItemId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Item not found");
  }

  let imageUrl: string;
  try {
    imageUrl = await storeMenuItemImage(file, bid, menuItemId, req);
  } catch (err: any) {
    throw fail("INVALID_INPUT", err?.message ?? "Could not store image");
  }

  return menuCrud.updateBranchMenuItemImage(bid, branchMenuItemId, imageUrl);
});

export const clearMenuItemImage = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const branchMenuItemId = Number(req.params.branchMenuItemId);
  if (!Number.isFinite(branchMenuItemId)) throw fail("INVALID_INPUT", "Invalid item id");
  try {
    return await menuCrud.updateBranchMenuItemImage(branchId(req), branchMenuItemId, null);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Item not found");
  }
});

export const deleteMenuItem = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const branchMenuItemId = Number(req.params.branchMenuItemId);
  if (!Number.isFinite(branchMenuItemId)) throw fail("INVALID_INPUT", "Invalid item id");
  try {
    return await menuCrud.deleteBranchMenuItem(branchId(req), branchMenuItemId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Item not found");
  }
});

export const createVariantGroupHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const menuItemId = Number(req.params.menuItemId);
  if (!Number.isFinite(menuItemId)) throw fail("INVALID_INPUT", "Invalid menu item id");
  if (!req.body?.name?.trim()) throw fail("INVALID_INPUT", "Group name is required");
  try {
    return await menuCrud.createVariantGroup(branchId(req), menuItemId, req.body);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Could not create variant group");
  }
});

export const updateVariantGroupFull = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId) throw fail("INVALID_INPUT", "group id is required");
  try {
    return await menuCrud.updateVariantGroupFull(branchId(req), groupId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Variant group not found");
  }
});

export const deleteVariantGroupHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId) throw fail("INVALID_INPUT", "group id is required");
  try {
    return await menuCrud.deleteVariantGroup(branchId(req), groupId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Variant group not found");
  }
});

export const createVariantHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId || !req.body?.name?.trim()) throw fail("INVALID_INPUT", "name is required");
  try {
    return await menuCrud.createVariant(branchId(req), groupId, req.body);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Could not create variant");
  }
});

export const updateVariantHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const variantId = req.params.variantId;
  if (!variantId) throw fail("INVALID_INPUT", "variant id is required");
  try {
    return await menuCrud.updateVariant(branchId(req), variantId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Variant not found");
  }
});

export const deleteVariantHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const variantId = req.params.variantId;
  if (!variantId) throw fail("INVALID_INPUT", "variant id is required");
  try {
    return await menuCrud.deleteVariant(branchId(req), variantId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Variant not found");
  }
});

export const createAddOnGroupHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const menuItemId = Number(req.params.menuItemId);
  if (!Number.isFinite(menuItemId)) throw fail("INVALID_INPUT", "Invalid menu item id");
  if (!req.body?.name?.trim()) throw fail("INVALID_INPUT", "Group name is required");
  try {
    return await menuCrud.createAddOnGroup(branchId(req), menuItemId, req.body);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Could not create add-on group");
  }
});

export const updateAddOnGroupHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId) throw fail("INVALID_INPUT", "group id is required");
  try {
    return await menuCrud.updateAddOnGroup(branchId(req), groupId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Add-on group not found");
  }
});

export const deleteAddOnGroupHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId) throw fail("INVALID_INPUT", "group id is required");
  try {
    return await menuCrud.deleteAddOnGroup(branchId(req), groupId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Add-on group not found");
  }
});

export const createAddOnHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const groupId = req.params.groupId;
  if (!groupId || !req.body?.name?.trim()) throw fail("INVALID_INPUT", "name is required");
  try {
    return await menuCrud.createAddOn(branchId(req), groupId, req.body);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Could not create add-on");
  }
});

export const updateAddOnHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const addOnId = req.params.addOnId;
  if (!addOnId) throw fail("INVALID_INPUT", "add-on id is required");
  try {
    return await menuCrud.updateAddOn(branchId(req), addOnId, req.body ?? {});
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Add-on not found");
  }
});

export const deleteAddOnHandler = wrap(async (req: Request) => {
  await requireStructureEdit(req);
  const addOnId = req.params.addOnId;
  if (!addOnId) throw fail("INVALID_INPUT", "add-on id is required");
  try {
    return await menuCrud.deleteAddOn(branchId(req), addOnId);
  } catch (err: any) {
    throw fail("NOT_FOUND", err?.message ?? "Add-on not found");
  }
});
