import { prisma } from "../../prisma/client.js";
export class ItemService {
    static async getAll(branchId) {
        return prisma.menuItem.findMany({
            orderBy: { name: "asc" },
            include: {
                category: true
            }
        });
    }
    static async getById(id, branchId) {
        return prisma.menuItem.findFirst({
            where: { id },
            include: {
                category: true
            }
        });
    }
    static async create(branchId, data) {
        return prisma.menuItem.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.menuItem.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.menuItem.deleteMany({
            where: { id }
        });
    }
}
