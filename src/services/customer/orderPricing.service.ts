import {
  getBranchItemForCustomer,
  priceForAddOn
} from "./branchMenu.service.ts";
import { normalizeSizeKey } from "./extraPricing.service.ts";

export type IncomingOrderLine = {
  itemId?: number;
  product_id?: number;
  item_id?: number;
  id?: number;
  item?: { id?: number };
  quantity?: number;
  qty?: number;
  variantId?: string;
  variant_id?: string;
  variants?: Array<{ id?: string; name?: string; price?: number }>;
  variantSelections?: Array<{ id?: string; name?: string; price?: number }>;
  addOnIds?: string[];
  add_on_ids?: string[];
  addOns?: Array<{ id?: string; name?: string; price?: number }>;
  extras?: Array<{ id?: string; name?: string; price?: number }>;
  notes?: string;
  note?: string;
  price?: number;
  unit_price?: number;
};

type MenuOption = {
  id: string;
  name: string;
  price: number;
  included?: boolean;
  pricesBySize?: Record<string, number> | null;
};

type MenuVariantGroup = {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  included?: boolean;
  options: MenuOption[];
};

type MenuAddOnGroup = {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  options: MenuOption[];
};

type MenuItemDetails = {
  id: number;
  name: string;
  price: number;
  variantGroups: MenuVariantGroup[];
  addOnGroups: MenuAddOnGroup[];
};

export type PricedOrderLine = {
  itemId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  notes: string | null;
  variantId: string;
  addOnIds: string[];
  variants: Array<{ name: string; price: number }>;
  addOns: Array<{ id: string; name: string; price: number }>;
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveItemId(line: IncomingOrderLine): number {
  const raw = line.itemId ?? line.product_id ?? line.item_id ?? line.item?.id ?? line.id;
  const itemId = Number(raw);
  if (!Number.isFinite(itemId) || itemId <= 0) {
    throw new Error("Each order item must include a valid itemId");
  }
  return itemId;
}

function resolveQuantity(line: IncomingOrderLine): number {
  const qty = Number(line.quantity ?? line.qty ?? 1);
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
    throw new Error("Item quantity must be between 1 and 99");
  }
  return qty;
}

function collectVariantIds(line: IncomingOrderLine): string[] {
  const ids = new Set<string>();
  const primary = line.variantId ?? line.variant_id;
  if (primary) ids.add(String(primary));

  for (const variant of line.variants ?? line.variantSelections ?? []) {
    if (variant?.id) ids.add(String(variant.id));
  }

  return [...ids];
}

function collectAddOnIds(line: IncomingOrderLine): string[] {
  const ids = new Set<string>();
  for (const id of line.addOnIds ?? line.add_on_ids ?? []) {
    if (id) ids.add(String(id));
  }
  for (const addOn of line.addOns ?? line.extras ?? []) {
    if (addOn?.id) ids.add(String(addOn.id));
  }
  return [...ids];
}

function findVariantOption(groups: MenuVariantGroup[], optionId: string) {
  for (const group of groups) {
    const option = group.options.find((o) => o.id === optionId);
    if (option) return { group, option };
  }
  return null;
}

function findAddOnOption(groups: MenuAddOnGroup[], optionId: string) {
  for (const group of groups) {
    const option = group.options.find((o) => o.id === optionId);
    if (option) return { group, option };
  }
  return null;
}

function selectedSizeName(variants: Array<{ name: string }>): string | null {
  for (const variant of variants) {
    if (normalizeSizeKey(variant.name)) return variant.name;
  }
  return null;
}

export function calculateUnitPrice(
  menuItem: MenuItemDetails,
  selectedVariants: Array<{ name: string; price: number }>,
  selectedAddOns: Array<{ id: string; name: string; price: number }>
): number {
  const paidVariantTotal = selectedVariants
    .filter((v) => v.price > 0)
    .reduce((sum, v) => sum + v.price, 0);
  const base = paidVariantTotal > 0 ? paidVariantTotal : menuItem.price;
  const extrasTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  return roundMoney(base + extrasTotal);
}

export function priceOrderLineFromMenu(
  menuItem: MenuItemDetails,
  line: IncomingOrderLine
): PricedOrderLine {
  const itemId = menuItem.id;
  const quantity = resolveQuantity(line);
  const variantIds = collectVariantIds(line);
  const addOnIds = collectAddOnIds(line);

  const selectedByGroup = new Map<string, MenuOption[]>();

  for (const optionId of variantIds) {
    const match = findVariantOption(menuItem.variantGroups, optionId);
    if (!match) {
      throw new Error(`Invalid option for ${menuItem.name}`);
    }
    const existing = selectedByGroup.get(match.group.id) ?? [];
    if (existing.some((o) => o.id === match.option.id)) continue;
    if (existing.length >= match.group.maxSelect) {
      throw new Error(`Too many selections for ${match.group.name}`);
    }
    existing.push(match.option);
    selectedByGroup.set(match.group.id, existing);
  }

  for (const group of menuItem.variantGroups) {
    const selected = selectedByGroup.get(group.id) ?? [];
    if (group.required && selected.length < Math.max(1, group.minSelect)) {
      throw new Error(`Please choose ${group.name} for ${menuItem.name}`);
    }
  }

  const variants = menuItem.variantGroups.flatMap((group) => {
    const selected = selectedByGroup.get(group.id) ?? [];
    return selected.map((option) => ({
      name: option.name,
      price: group.included || option.included ? 0 : option.price
    }));
  });

  const sizeName = selectedSizeName(variants);
  const selectedAddOns: Array<{ id: string; name: string; price: number }> = [];
  const addOnsByGroup = new Map<string, string[]>();

  for (const addOnId of addOnIds) {
    const match = findAddOnOption(menuItem.addOnGroups, addOnId);
    if (!match) {
      throw new Error(`Invalid extra for ${menuItem.name}`);
    }
    const groupSelections = addOnsByGroup.get(match.group.id) ?? [];
    if (groupSelections.includes(addOnId)) continue;
    if (groupSelections.length >= match.group.maxSelect) {
      throw new Error(`Too many extras selected for ${match.group.name}`);
    }
    groupSelections.push(addOnId);
    addOnsByGroup.set(match.group.id, groupSelections);

    selectedAddOns.push({
      id: match.option.id,
      name: match.option.name,
      price: roundMoney(
        priceForAddOn(
          {
            name: match.option.name,
            price: match.option.price,
            pricesBySize: match.option.pricesBySize
          },
          sizeName,
          menuItem.name
        )
      )
    });
  }

  for (const group of menuItem.addOnGroups) {
    const selected = addOnsByGroup.get(group.id) ?? [];
    if (group.required && selected.length < Math.max(1, group.minSelect)) {
      throw new Error(`Please choose ${group.name} for ${menuItem.name}`);
    }
  }

  const unitPrice = calculateUnitPrice(menuItem, variants, selectedAddOns);
  const primaryVariantId =
    line.variantId ??
    line.variant_id ??
    variantIds[0] ??
    String(itemId);

  return {
    itemId,
    quantity,
    unitPrice,
    lineTotal: roundMoney(unitPrice * quantity),
    notes: line.notes ?? line.note ?? null,
    variantId: String(primaryVariantId),
    addOnIds: selectedAddOns.map((a) => a.id),
    variants,
    addOns: selectedAddOns
  };
}

export async function validateAndPriceOrderLines(
  branchId: string,
  lines: IncomingOrderLine[]
): Promise<{ pricedLines: PricedOrderLine[]; subtotal: number }> {
  if (!lines.length) {
    throw new Error("Order must include at least one item");
  }

  const uniqueItemIds = [...new Set(lines.map((line) => resolveItemId(line)))];
  const menuItemsById = new Map<number, MenuItemDetails>();

  await Promise.all(
    uniqueItemIds.map(async (itemId) => {
      const menuItem = await getBranchItemForCustomer(branchId, itemId, "de");
      if (menuItem) menuItemsById.set(itemId, menuItem as MenuItemDetails);
    })
  );

  const pricedLines: PricedOrderLine[] = [];

  for (const line of lines) {
    const itemId = resolveItemId(line);
    const menuItem = menuItemsById.get(itemId);
    if (!menuItem) {
      throw new Error(`Menu item ${itemId} is not available at this branch`);
    }

    pricedLines.push(priceOrderLineFromMenu(menuItem, line));
  }

  const subtotal = roundMoney(pricedLines.reduce((sum, line) => sum + line.lineTotal, 0));
  return { pricedLines, subtotal };
}
