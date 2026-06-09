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
                menuItems: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        tags: true,
                        stock: true,
                        lowStockThreshold: true,
                        autoDisable: true,
                        kitchen: true,
                        categoryId: true
                    }
                }
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
    async createVariant(_data) {
        void _data;
        throw new Error("Variants are not supported by the current schema");
    }
    async updateVariant(_id, _data) {
        void _id;
        void _data;
        throw new Error("Variants are not supported by the current schema");
    }
    async deleteVariant(_id) {
        void _id;
        throw new Error("Variants are not supported by the current schema");
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
    async setVariantAvailability(_id, _available) {
        void _id;
        void _available;
        throw new Error("Variants are not supported by the current schema");
    }
}
export const menuService = new MenuService();
