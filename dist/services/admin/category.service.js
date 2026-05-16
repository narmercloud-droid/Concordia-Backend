import { prisma } from "../../prisma/client.js";
export class CategoryService {
    static async getAll(branchId) {
        return prisma.category.findMany({
            orderBy: { position: "asc" },
            include: {
                items: true
            }
        });
    }
    static async getById(id, branchId) {
        return prisma.category.findFirst({
            where: { id },
            include: {
                items: true
            }
        });
    }
    static async create(branchId, data) {
        return prisma.category.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.category.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.category.deleteMany({
            where: { id }
        });
    }
}
