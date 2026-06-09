import { menuService } from "../services/menu.service.js";
import { wrap } from "../contracts/api.js";
export const MenuController = {
    // Categories
    createCategory: wrap(async (req) => {
        const category = await menuService.createCategory(req.body);
        return category;
    }),
    updateCategory: wrap(async (req) => {
        const category = await menuService.updateCategory(req.params.id, req.body);
        return category;
    }),
    deleteCategory: wrap(async (req) => {
        await menuService.deleteCategory(req.params.id);
        return { success: true };
    }),
    // Items
    createItem: wrap(async (req) => {
        const item = await menuService.createItem(req.body);
        return item;
    }),
    updateItem: wrap(async (req) => {
        const item = await menuService.updateItem(req.params.id, req.body);
        return item;
    }),
    deleteItem: wrap(async (req) => {
        await menuService.deleteItem(req.params.id);
        return { success: true };
    }),
    // Variants
    createVariant: wrap(async (req) => {
        const variant = await menuService.createVariant(req.body);
        return variant;
    }),
    updateVariant: wrap(async (req) => {
        const variant = await menuService.updateVariant(req.params.id, req.body);
        return variant;
    }),
    deleteVariant: wrap(async (req) => {
        await menuService.deleteVariant(req.params.id);
        return { success: true };
    }),
    // Availability
    setItemAvailability: wrap(async (req) => {
        const updated = await menuService.setItemAvailability(req.params.id, req.body.available);
        return updated;
    }),
    setVariantAvailability: wrap(async (req) => {
        const updated = await menuService.setVariantAvailability(req.params.id, req.body.available);
        return updated;
    }),
    // Customer menu browsing
    listMenu: wrap(async (_req) => {
        const menu = await menuService.listCategories();
        return menu;
    })
};
