import { prisma } from "../../prisma/client.js";
export class VariantService {
    static async getAll() {
        return prisma.variant.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return prisma.variant.findUnique({
            where: { variant_id: id }
        });
    }
    static async create(data) {
        return prisma.variant.create({ data });
    }
    static async update(id, data) {
        return prisma.variant.update({
            where: { variant_id: id },
            data
        });
    }
    static async remove(id) {
        return prisma.variant.delete({
            where: { variant_id: id }
        });
    }
}
