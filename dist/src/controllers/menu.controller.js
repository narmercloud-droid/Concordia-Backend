import { menuService } from "../services/menu.service.js";
import { success } from "./controllerHelper.js";
export const MenuController = {
    // Categories
    createCategory: async (req, res, next) => {
        const category = await menuService.createCategory(req.body);
        return success(res, category);
    },
    updateCategory: async (req, res, next) => {
        const category = await menuService.updateCategory(req.params.id, req.body);
        return success(res, category);
    },
    deleteCategory: async (req, res, next) => {
        const category = await menuService.deleteCategory(req.params.id);
        return success(res, category);
    },
    // Items
    createItem: async (req, res, next) => {
        const item = await menuService.createItem(req.body);
        return success(res, item);
    },
    updateItem: async (req, res, next) => {
        const item = await menuService.updateItem(req.params.id, req.body);
        return success(res, item);
    },
    deleteItem: async (req, res, next) => {
        const item = await menuService.deleteItem(req.params.id);
        return success(res, item);
    },
    // Variants
    createVariant: async (req, res, next) => {
        const variant = await menuService.createVariant(req.body);
        return success(res, variant);
    },
    updateVariant: async (req, res, next) => {
        const variant = await menuService.updateVariant(req.params.id, req.body);
        return success(res, variant);
    },
    deleteVariant: async (req, res, next) => {
        const variant = await menuService.deleteVariant(req.params.id);
        return success(res, variant);
    },
    // Availability
    setItemAvailability: async (req, res, next) => {
        const item = await menuService.setItemAvailability(req.params.id, req.body.available);
        return success(res, item);
    },
    setVariantAvailability: async (req, res, next) => {
        const variant = await menuService.setVariantAvailability(req.params.id, req.body.available);
        return success(res, variant);
    },
    // Customer menu browsing
    listMenu: async (req, res, next) => {
        const menu = await menuService.listCategories();
        return success(res, menu);
    }
};
