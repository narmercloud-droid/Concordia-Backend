import type { Request  } from "express";
import { menuService } from "../services/menu.service.ts";
import { wrap } from "../contracts/api.js";

export const MenuController = {
  // Categories
  createCategory: wrap(async (req: Request) => {
    const category = await menuService.createCategory(req.body);
    return category;
  }),

  updateCategory: wrap(async (req: Request) => {
    const category = await menuService.updateCategory(req.params.id, req.body);
    return category;
  }),

  deleteCategory: wrap(async (req: Request) => {
    await menuService.deleteCategory(req.params.id);
    return { success: true };
  }),

  // Items
  createItem: wrap(async (req: Request) => {
    const item = await menuService.createItem(req.body);
    return item;
  }),

  updateItem: wrap(async (req: Request) => {
    const item = await menuService.updateItem(req.params.id, req.body);
    return item;
  }),

  deleteItem: wrap(async (req: Request) => {
    await menuService.deleteItem(req.params.id);
    return { success: true };
  }),

  // Variants
  createVariant: wrap(async (req: Request) => {
    const variant = await menuService.createVariant(req.body);
    return variant;
  }),

  updateVariant: wrap(async (req: Request) => {
    const variant = await menuService.updateVariant(req.params.id, req.body);
    return variant;
  }),

  deleteVariant: wrap(async (req: Request) => {
    await menuService.deleteVariant(req.params.id);
    return { success: true };
  }),

  // Availability
  setItemAvailability: wrap(async (req: Request) => {
    const updated = await menuService.setItemAvailability(req.params.id, req.body.available);
    return updated;
  }),

  setVariantAvailability: wrap(async (req: Request) => {
    const updated = await menuService.setVariantAvailability(req.params.id, req.body.available);
    return updated;
  }),

  // Customer menu browsing
  listMenu: wrap(async (_req: Request) => {
    const menu = await menuService.listCategories();
    return menu;
  })
};






