import { prisma } from "../prisma/client.js";
export class MenuService {
    // Categories
    async createCategory(data) {
        return prisma.category.create({ data });
    }
    async updateCategory(id, data) {
        return prisma.category.update({ where: { id }, data });
    }
    async deleteCategory(id) {
        return prisma.category.delete({ where: { id } });
    }
    async listCategories() {
        return prisma.category.findMany({
            orderBy: { position: "asc" },
            include: {
                items: true
            }
        });
    }
    // Items
    async createItem(data) {
        return prisma.menuItem.create({ data });
    }
    async updateItem(id, data) {
        return prisma.menuItem.update({ where: { id }, data });
    }
    async deleteItem(id) {
        return prisma.menuItem.delete({ where: { id } });
    }
    // Variants
    async createVariant(data) {
        return prisma.variant.create({ data });
    }
    async updateVariant(id, data) {
        return prisma.variant.update({ where: { id }, data });
    }
    async deleteVariant(id) {
        return prisma.variant.delete({ where: { id } });
    }
    // Add-on groups
    async createAddOnGroup(data) {
        return prisma.addOnGroup.create({ data });
    }
    async updateAddOnGroup(id, data) {
        return prisma.addOnGroup.update({ where: { id }, data });
    }
    async deleteAddOnGroup(id) {
        return prisma.addOnGroup.delete({ where: { id } });
    }
    // Add-ons
    async createAddOn(data) {
        return prisma.addOn.create({ data });
    }
    async updateAddOn(id, data) {
        return prisma.addOn.update({ where: { id }, data });
    }
    async deleteAddOn(id) {
        return prisma.addOn.delete({ where: { id } });
    }
    // Terminal sold-out controls
    async setItemAvailability(id, isAvailable) {
        return prisma.menuItem.update({
            where: { id },
            data: { isAvailable }
        });
    }
    async setVariantAvailability(id, isAvailable) {
        return prisma.menuVariant.update({
            where: { id },
            data: { isAvailable }
        });
    }
    async setAddOnAvailability(id, isAvailable) {
        return prisma.addOn.update({
            where: { id },
            data: { isAvailable }
        });
    }
}
export const menuService = new MenuService();
