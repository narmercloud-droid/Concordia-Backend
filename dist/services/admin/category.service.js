import { prisma } from "../../prisma/client.js";
export class CategoryService {
    static async getAll() {
        return prisma.category.findMany({
            orderBy: { name: "asc" }
        });
    }
    static async getById(id) {
        return prisma.category.findUnique({
            where: { id }
        });
    }
    static async create(data) {
        return prisma.category.create({ data });
    }
    static async update(id, data) {
        return prisma.category.update({
            where: { id },
            data
        });
    }
    static async remove(id) {
        return prisma.category.delete({
            where: { id }
        });
    }
}
