import { prisma } from "../../prisma/client.js";
export class DealService {
    static async getAll(branchId) {
        return prisma.deal.findMany({
            orderBy: { name: "asc" }
        });
    }
    static async getById(id, branchId) {
        return prisma.deal.findFirst({
            where: { id }
        });
    }
    static async create(branchId, data) {
        return prisma.deal.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.deal.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.deal.deleteMany({
            where: { id }
        });
    }
}
