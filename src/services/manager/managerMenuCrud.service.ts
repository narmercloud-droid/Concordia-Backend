import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";
import { invalidateBranchMenuCache } from "../customer/branchMenu.service.ts";

function menuItemIdRange(branchId: string) {
  if (branchId === "concordia-kempen") return { gte: 10000, lt: 20000 };
  if (branchId === "concordia-straelen") return { gte: 20000, lt: 30000 };
  return { gte: 1, lt: 1_000_000 };
}

async function nextMenuItemId(branchId: string) {
  const range = menuItemIdRange(branchId);
  const max = await prisma.menuItem.aggregate({
    where: { id: { gte: range.gte, lt: range.lt } },
    _max: { id: true }
  });
  const next = (max._max.id ?? range.gte - 1) + 1;
  if (next >= range.lt) throw new Error("No menu item IDs left for this branch");
  return next;
}

function bumpMenuCache(branchId: string) {
  invalidateBranchMenuCache(branchId);
}

async function assertBranchMenuItem(branchId: string, branchMenuItemId: number) {
  const row = await prisma.branchMenuItem.findFirst({
    where: { id: branchMenuItemId, branchId },
    include: { menuItem: true }
  });
  if (!row) throw new Error("Menu item not found for this branch");
  return row;
}

async function assertMenuItemOnBranch(branchId: string, menuItemId: number) {
  const row = await prisma.branchMenuItem.findFirst({
    where: { branchId, menuItemId },
    include: {
      menuItem: {
        include: {
          variantGroups: { include: { variants: true }, orderBy: { id: "asc" } },
          addOnGroups: { include: { addOns: true }, orderBy: { id: "asc" } }
        }
      }
    }
  });
  if (!row) throw new Error("Menu item not found for this branch");
  return row;
}

async function assertVariantGroupOnBranch(branchId: string, groupId: string) {
  const group = await prisma.variantGroup.findUnique({
    where: { id: groupId },
    include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } }
  });
  if (!group?.item.branchItems.length) throw new Error("Variant group not found for this branch");
  return group;
}

async function assertAddOnGroupOnBranch(branchId: string, groupId: string) {
  const group = await prisma.addOnGroup.findUnique({
    where: { id: groupId },
    include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } }
  });
  if (!group?.item.branchItems.length) throw new Error("Add-on group not found for this branch");
  return group;
}

export async function getManagerMenuItemDetail(branchId: string, menuItemId: number) {
  const row = await assertMenuItemOnBranch(branchId, menuItemId);
  const item = row.menuItem;

  return {
    branchMenuItemId: row.id,
    menuItemId: item.id,
    categoryId: row.categoryId,
    name: item.name,
    description: row.description ?? item.description,
    price: row.price ?? item.basePrice ?? 0,
    kitchen: item.kitchen ?? "B",
    itemNumber: item.itemNumber,
    sortOrder: item.sortOrder ?? 0,
    isAvailable: row.isAvailable,
    imageUrl: row.imageUrl ?? item.imageUrl,
    variantGroups: item.variantGroups.map((g) => ({
      id: g.id,
      name: g.name,
      required: g.required,
      minSelect: g.minSelect,
      maxSelect: g.maxSelect,
      includedChoice: g.includedChoice,
      variants: g.variants.map((v) => ({ id: v.id, name: v.name, price: v.price }))
    })),
    addOnGroups: item.addOnGroups.map((g) => ({
      id: g.id,
      name: g.name,
      required: g.required,
      minSelect: g.minSelect,
      maxSelect: g.maxSelect,
      addOns: g.addOns.map((a) => ({ id: a.id, name: a.name, price: a.price }))
    }))
  };
}

export async function createBranchCategory(
  branchId: string,
  data: { name: string; description?: string; sortOrder?: number }
) {
  const created = await prisma.branchCategory.create({
    data: {
      branchId,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      sortOrder: data.sortOrder ?? 0
    }
  });
  bumpMenuCache(branchId);
  return created;
}

export async function updateBranchCategory(
  branchId: string,
  categoryId: number,
  data: { name?: string; description?: string; sortOrder?: number }
) {
  const existing = await prisma.branchCategory.findFirst({
    where: { id: categoryId, branchId }
  });
  if (!existing) throw new Error("Category not found");

  const updated = await prisma.branchCategory.update({
    where: { id: categoryId },
    data: {
      name: data.name?.trim() ?? undefined,
      description: data.description !== undefined ? data.description?.trim() || null : undefined,
      sortOrder: data.sortOrder ?? undefined
    }
  });
  bumpMenuCache(branchId);
  return updated;
}

export async function deleteBranchCategory(branchId: string, categoryId: number) {
  const existing = await prisma.branchCategory.findFirst({
    where: { id: categoryId, branchId },
    include: { items: true }
  });
  if (!existing) throw new Error("Category not found");
  if (existing.items.length > 0) {
    throw new Error("Move or delete items in this category first");
  }

  await prisma.branchCategory.delete({ where: { id: categoryId } });
  bumpMenuCache(branchId);
  return { success: true };
}

export async function createBranchMenuItem(
  branchId: string,
  data: {
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    kitchen?: string;
    itemNumber?: string;
    sortOrder?: number;
    isAvailable?: boolean;
  }
) {
  const category = await prisma.branchCategory.findFirst({
    where: { id: data.categoryId, branchId }
  });
  if (!category) throw new Error("Category not found");

  const menuItemId = await nextMenuItemId(branchId);

  const result = await prisma.$transaction(async (tx) => {
    const menuItem = await tx.menuItem.create({
      data: {
        id: menuItemId,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        basePrice: data.price,
        kitchen: data.kitchen === "A" ? "A" : "B",
        itemNumber: data.itemNumber?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        isAvailable: data.isAvailable !== false
      }
    });

    const branchItem = await tx.branchMenuItem.create({
      data: {
        branchId,
        menuItemId: menuItem.id,
        categoryId: data.categoryId,
        price: data.price,
        description: data.description?.trim() || null,
        isAvailable: data.isAvailable !== false
      },
      include: { menuItem: true }
    });

    return branchItem;
  });

  bumpMenuCache(branchId);
  return result;
}

export async function updateBranchMenuItemFull(
  branchId: string,
  branchMenuItemId: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    kitchen?: string;
    categoryId?: number;
    itemNumber?: string;
    sortOrder?: number;
    isAvailable?: boolean;
  }
) {
  const row = await assertBranchMenuItem(branchId, branchMenuItemId);

  if (data.categoryId != null) {
    const category = await prisma.branchCategory.findFirst({
      where: { id: data.categoryId, branchId }
    });
    if (!category) throw new Error("Category not found");
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.menuItem.update({
      where: { id: row.menuItemId },
      data: {
        name: data.name?.trim() ?? undefined,
        description: data.description !== undefined ? data.description?.trim() || null : undefined,
        basePrice: data.price ?? undefined,
        kitchen: data.kitchen === "A" ? "A" : data.kitchen === "B" ? "B" : undefined,
        itemNumber: data.itemNumber !== undefined ? data.itemNumber?.trim() || null : undefined,
        sortOrder: data.sortOrder ?? undefined,
        isAvailable: data.isAvailable ?? undefined
      }
    });

    return tx.branchMenuItem.update({
      where: { id: branchMenuItemId },
      data: {
        price: data.price ?? undefined,
        description: data.description !== undefined ? data.description?.trim() || null : undefined,
        categoryId: data.categoryId ?? undefined,
        isAvailable: data.isAvailable ?? undefined
      },
      include: { menuItem: true }
    });
  });

  bumpMenuCache(branchId);
  return updated;
}

export async function deleteBranchMenuItem(branchId: string, branchMenuItemId: number) {
  const row = await assertBranchMenuItem(branchId, branchMenuItemId);

  await prisma.$transaction(async (tx) => {
    await tx.branchMenuItem.update({
      where: { id: branchMenuItemId },
      data: { isAvailable: false }
    });
    await tx.menuItem.update({
      where: { id: row.menuItemId },
      data: { isAvailable: false }
    });
  });

  bumpMenuCache(branchId);
  return { success: true };
}

export async function createVariantGroup(
  branchId: string,
  menuItemId: number,
  data: {
    name: string;
    required?: boolean;
    minSelect?: number;
    maxSelect?: number;
    includedChoice?: boolean;
    variants?: Array<{ name: string; price: number }>;
  }
) {
  await assertMenuItemOnBranch(branchId, menuItemId);

  const group = await prisma.variantGroup.create({
    data: {
      id: randomUUID(),
      itemId: menuItemId,
      name: data.name.trim(),
      required: data.required ?? false,
      minSelect: data.minSelect ?? 0,
      maxSelect: data.maxSelect ?? 1,
      includedChoice: data.includedChoice ?? false,
      variants: {
        create: (data.variants ?? []).map((v) => ({
          id: randomUUID(),
          name: v.name.trim(),
          price: Number(v.price) || 0
        }))
      }
    },
    include: { variants: true }
  });

  bumpMenuCache(branchId);
  return group;
}

export async function updateVariantGroupFull(
  branchId: string,
  groupId: string,
  data: {
    name?: string;
    required?: boolean;
    minSelect?: number;
    maxSelect?: number;
    includedChoice?: boolean;
  }
) {
  await assertVariantGroupOnBranch(branchId, groupId);

  const updated = await prisma.variantGroup.update({
    where: { id: groupId },
    data: {
      name: data.name?.trim() ?? undefined,
      required: data.required ?? undefined,
      minSelect: data.minSelect ?? undefined,
      maxSelect: data.maxSelect ?? undefined,
      includedChoice: data.includedChoice ?? undefined
    },
    include: { variants: true }
  });

  bumpMenuCache(branchId);
  return updated;
}

export async function deleteVariantGroup(branchId: string, groupId: string) {
  await assertVariantGroupOnBranch(branchId, groupId);
  await prisma.variantGroup.delete({ where: { id: groupId } });
  bumpMenuCache(branchId);
  return { success: true };
}

export async function createVariant(
  branchId: string,
  groupId: string,
  data: { name: string; price: number }
) {
  await assertVariantGroupOnBranch(branchId, groupId);

  const variant = await prisma.variant.create({
    data: {
      id: randomUUID(),
      groupId,
      name: data.name.trim(),
      price: Number(data.price) || 0
    }
  });

  bumpMenuCache(branchId);
  return variant;
}

export async function updateVariant(
  branchId: string,
  variantId: string,
  data: { name?: string; price?: number }
) {
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { group: { include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } } } }
  });
  if (!variant?.group.item.branchItems.length) throw new Error("Variant not found for this branch");

  const updated = await prisma.variant.update({
    where: { id: variantId },
    data: {
      name: data.name?.trim() ?? undefined,
      price: data.price != null ? Number(data.price) : undefined
    }
  });

  bumpMenuCache(branchId);
  return updated;
}

export async function deleteVariant(branchId: string, variantId: string) {
  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { group: { include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } } } }
  });
  if (!variant?.group.item.branchItems.length) throw new Error("Variant not found for this branch");

  await prisma.variant.delete({ where: { id: variantId } });
  bumpMenuCache(branchId);
  return { success: true };
}

export async function createAddOnGroup(
  branchId: string,
  menuItemId: number,
  data: {
    name: string;
    required?: boolean;
    minSelect?: number;
    maxSelect?: number;
    addOns?: Array<{ name: string; price: number }>;
  }
) {
  await assertMenuItemOnBranch(branchId, menuItemId);

  const group = await prisma.addOnGroup.create({
    data: {
      id: randomUUID(),
      itemId: menuItemId,
      name: data.name.trim(),
      required: data.required ?? false,
      minSelect: data.minSelect ?? 0,
      maxSelect: data.maxSelect ?? 5,
      addOns: {
        create: (data.addOns ?? []).map((a) => ({
          id: randomUUID(),
          name: a.name.trim(),
          price: Number(a.price) || 0
        }))
      }
    },
    include: { addOns: true }
  });

  bumpMenuCache(branchId);
  return group;
}

export async function updateAddOnGroup(
  branchId: string,
  groupId: string,
  data: {
    name?: string;
    required?: boolean;
    minSelect?: number;
    maxSelect?: number;
  }
) {
  await assertAddOnGroupOnBranch(branchId, groupId);

  const updated = await prisma.addOnGroup.update({
    where: { id: groupId },
    data: {
      name: data.name?.trim() ?? undefined,
      required: data.required ?? undefined,
      minSelect: data.minSelect ?? undefined,
      maxSelect: data.maxSelect ?? undefined
    },
    include: { addOns: true }
  });

  bumpMenuCache(branchId);
  return updated;
}

export async function deleteAddOnGroup(branchId: string, groupId: string) {
  await assertAddOnGroupOnBranch(branchId, groupId);
  await prisma.addOnGroup.delete({ where: { id: groupId } });
  bumpMenuCache(branchId);
  return { success: true };
}

export async function createAddOn(
  branchId: string,
  groupId: string,
  data: { name: string; price: number }
) {
  await assertAddOnGroupOnBranch(branchId, groupId);

  const addOn = await prisma.addOn.create({
    data: {
      id: randomUUID(),
      groupId,
      name: data.name.trim(),
      price: Number(data.price) || 0
    }
  });

  bumpMenuCache(branchId);
  return addOn;
}

export async function updateAddOn(
  branchId: string,
  addOnId: string,
  data: { name?: string; price?: number }
) {
  const addOn = await prisma.addOn.findUnique({
    where: { id: addOnId },
    include: { group: { include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } } } }
  });
  if (!addOn?.group.item.branchItems.length) throw new Error("Add-on not found for this branch");

  const updated = await prisma.addOn.update({
    where: { id: addOnId },
    data: {
      name: data.name?.trim() ?? undefined,
      price: data.price != null ? Number(data.price) : undefined
    }
  });

  bumpMenuCache(branchId);
  return updated;
}

export async function deleteAddOn(branchId: string, addOnId: string) {
  const addOn = await prisma.addOn.findUnique({
    where: { id: addOnId },
    include: { group: { include: { item: { include: { branchItems: { where: { branchId }, take: 1 } } } } } }
  });
  if (!addOn?.group.item.branchItems.length) throw new Error("Add-on not found for this branch");

  await prisma.addOn.delete({ where: { id: addOnId } });
  bumpMenuCache(branchId);
  return { success: true };
}
