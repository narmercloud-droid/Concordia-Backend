import { menuService } from "../services/menu.service.js";
export const MenuController = {
    // Categories
    createCategory: async (req, res, next) => {
        const category = await menuService.createCategory(req.body);
        res.json(category);
    },
    updateCategory: async (req, res, next) => {
        const category = await menuService.updateCategory(req.params.id, req.body);
        res.json(category);
    },
    deleteCategory: async (req, res, next) => {
        const category = await menuService.deleteCategory(req.params.id);
        res.json(category);
    },
    // Items
    createItem: async (req, res, next) => {
        const item = await menuService.createItem(req.body);
        res.json(item);
    },
    updateItem: async (req, res, next) => {
        const item = await menuService.updateItem(req.params.id, req.body);
        res.json(item);
    },
    deleteItem: async (req, res, next) => {
        const item = await menuService.deleteItem(req.params.id);
        res.json(item);
    },
    // Variants
    createVariant: async (req, res, next) => {
        const variant = await menuService.createVariant(req.body);
        res.json(variant);
    },
    updateVariant: async (req, res, next) => {
        const variant = await menuService.updateVariant(req.params.id, req.body);
        res.json(variant);
    },
    deleteVariant: async (req, res, next) => {
        const variant = await menuService.deleteVariant(req.params.id);
        res.json(variant);
    },
    // Add-on groups
    createAddOnGroup: async (req, res, next) => {
        const group = await menuService.createAddOnGroup(req.body);
        res.json(group);
    },
    updateAddOnGroup: async (req, res, next) => {
        const group = await menuService.updateAddOnGroup(req.params.id, req.body);
        res.json(group);
    },
    deleteAddOnGroup: async (req, res, next) => {
        const group = await menuService.deleteAddOnGroup(req.params.id);
        res.json(group);
    },
    // Add-ons
    createAddOn: async (req, res, next) => {
        const addOn = await menuService.createAddOn(req.body);
        res.json(addOn);
    },
    updateAddOn: async (req, res, next) => {
        const addOn = await menuService.updateAddOn(req.params.id, req.body);
        res.json(addOn);
    },
    deleteAddOn: async (req, res, next) => {
        const addOn = await menuService.deleteAddOn(req.params.id);
        res.json(addOn);
    },
    // Availability
    setItemAvailability: async (req, res, next) => {
        const item = await menuService.setItemAvailability(req.params.id, req.body.isAvailable);
        res.json(item);
    },
    setVariantAvailability: async (req, res, next) => {
        const variant = await menuService.setVariantAvailability(req.params.id, req.body.isAvailable);
        res.json(variant);
    },
    setAddOnAvailability: async (req, res, next) => {
        const addOn = await menuService.setAddOnAvailability(req.params.id, req.body.isAvailable);
        res.json(addOn);
    },
    // Customer menu browsing
    listMenu: async (req, res, next) => {
        const menu = await menuService.listCategories();
        res.json(menu);
    }
};
