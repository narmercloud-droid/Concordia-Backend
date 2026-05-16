import { prisma } from "../../prisma/client.js";
export class ToppingService {
    static async getAll(branchId) {
        return prisma.topping.findMany({
            orderBy: { name: "asc" }
        });
    }
    static async getById(id, branchId) {
        return prisma.topping.findFirst({
            where: { id }
        });
    }
    static async create(branchId, data) {
        return prisma.topping.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.topping.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.topping.deleteMany({
            where: { id }
        });
    }
}
