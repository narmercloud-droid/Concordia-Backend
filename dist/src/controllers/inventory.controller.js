"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
exports.InventoryController = {
    updateStock: async (req, res) => {
        const { itemId, stock } = req.body;
        const result = await inventory_service_1.inventoryService.updateStock(itemId, stock);
        res.json(result);
    },
    lowStock: async (req, res) => {
        const branchId = req.user.branchId;
        const items = await inventory_service_1.inventoryService.getLowStock(branchId);
        res.json(items);
    }
};
