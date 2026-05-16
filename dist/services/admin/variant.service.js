import { prisma } from "../../prisma/client.js";
export class VariantService {
    static async getAll(branchId) {
        return prisma.variant.findMany({
            orderBy: { name: "asc" }
        });
    }
    static async getById(id, branchId) {
        return prisma.variant.findFirst({
            where: { id }
        });
    }
    static async create(branchId, data) {
        return prisma.variant.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.variant.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.variant.deleteMany({
            where: { id }
        });
    }
}
