import { prisma } from "../../prisma/client.js";
export class ExtraService {
    static async getAll(branchId) {
        return prisma.extra.findMany({
            orderBy: { name: "asc" }
        });
    }
    static async getById(id, branchId) {
        return prisma.extra.findFirst({
            where: { id }
        });
    }
    static async create(branchId, data) {
        return prisma.extra.create({ data });
    }
    static async update(id, branchId, data) {
        return prisma.extra.update({
            where: { id },
            data
        });
    }
    static async remove(id, branchId) {
        return prisma.extra.deleteMany({
            where: { id }
        });
    }
}
