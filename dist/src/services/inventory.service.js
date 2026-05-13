"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const notifications_service_1 = require("./notifications.service");
class InventoryService {
    async deductStock(orderId) {
        const items = await client_1.default.orderItem.findMany({
            where: { orderId },
            include: { item: true, variant: true, addons: true }
        });
        for (const entry of items) {
            // Deduct item stock
            if (entry.item.stock !== null) {
                const newStock = entry.item.stock - entry.quantity;
                await client_1.default.menuItem.update({
                    where: { id: entry.itemId },
                    data: { stock: newStock }
                });
                if (newStock <= 0 && entry.item.autoDisable) {
                    await client_1.default.menuItem.update({
                        where: { id: entry.itemId },
                        data: { available: false }
                    });
                }
                if (newStock <= entry.item.lowStockThreshold) {
                    await notifications_service_1.notificationsService.sendManagerAlert(entry.item.branchId, `Low stock: ${entry.item.name}`);
                }
            }
            // Deduct variant stock
            if (entry.variantId) {
                const variant = entry.variant;
                if (variant.stock !== null) {
                    const newStock = variant.stock - entry.quantity;
                    await client_1.default.menuItemVariant.update({
                        where: { id: variant.id },
                        data: { stock: newStock }
                    });
                    if (newStock <= 0 && variant.autoDisable) {
                        await client_1.default.menuItemVariant.update({
                            where: { id: variant.id },
                            data: { available: false }
                        });
                    }
                }
            }
            // Deduct addon stock
            for (const addon of entry.addons) {
                if (addon.stock !== null) {
                    const newStock = addon.stock - entry.quantity;
                    await client_1.default.menuItemAddon.update({
                        where: { id: addon.id },
                        data: { stock: newStock }
                    });
                    if (newStock <= 0 && addon.autoDisable) {
                        await client_1.default.menuItemAddon.update({
                            where: { id: addon.id },
                            data: { available: false }
                        });
                    }
                }
            }
        }
    }
    async getLowStock(branchId) {
        return client_1.default.menuItem.findMany({
            where: {
                branchId,
                stock: { lte: client_1.default.menuItem.fields.lowStockThreshold }
            }
        });
    }
    async updateStock(itemId, stock) {
        return client_1.default.menuItem.update({
            where: { id: itemId },
            data: { stock }
        });
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
