import { prisma } from "../../prisma/client.js";
export class VariantService {
    static async getAll() {
        return prisma.variant.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        return prisma.variant.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        return prisma.variant.create({ data });
    }
    static async update(id, data) {
        return prisma.variant.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        return prisma.variant.delete({
            where: { id },
        });
    }
}
