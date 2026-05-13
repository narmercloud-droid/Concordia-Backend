import { prisma } from "../../prisma/client.js";
export class ExtraService {
    static async getAll() {
        return prisma.extra.findMany({
            orderBy: { name: "asc" },
        });
    }
    static async getById(id) {
        return prisma.extra.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        return prisma.extra.create({ data });
    }
    static async update(id, data) {
        return prisma.extra.update({
            where: { id },
            data,
        });
    }
    static async remove(id) {
        return prisma.extra.delete({
            where: { id },
        });
    }
}
