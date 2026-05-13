import { prisma } from "../prisma/client.js";
export class MenuService {
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
    async createItem(data) {
        return prisma.menuItem.create({ data });
    }
    async updateItem(id, data) {
        return prisma.menuItem.update({ where: { id }, data });
    }
    async deleteItem(id) {
        return prisma.menuItem.delete({ where: { id } });
    }
    async createVariant(data) {
        return prisma.variant.create({ data });
    }
    async updateVariant(id, data) {
        return prisma.variant.update({ where: { id }, data });
    }
    async deleteVariant(id) {
        return prisma.variant.delete({ where: { id } });
    }
    async setItemAvailability(id, available) {
        const updated = await prisma.menuItem.update({
            where: { id },
            data: { autoDisable: !available }
        });
        return {
            ...updated,
            available: !updated.autoDisable
        };
    }
    async setVariantAvailability(id, available) {
        return prisma.variant.update({
            where: { id },
            data: { visible: available }
        });
    }
}
export const menuService = new MenuService();
