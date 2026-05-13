import { prisma } from "../../prisma/client.js";
export class ExtraService {
    static async getAll() {
        return prisma.extra.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return prisma.extra.findUnique({
            where: { extra_id: id }
        });
    }
    static async create(data) {
        return prisma.extra.create({ data });
    }
    static async update(id, data) {
        return prisma.extra.update({
            where: { extra_id: id },
            data
        });
    }
    static async remove(id) {
        return prisma.extra.delete({
            where: { extra_id: id }
        });
    }
}
