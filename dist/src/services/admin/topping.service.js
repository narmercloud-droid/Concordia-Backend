import { prisma } from "../../prisma/client.js";
export class ToppingService {
    static async getAll() {
        return prisma.topping.findMany({
            orderBy: { sort_order: "asc" }
        });
    }
    static async getById(id) {
        return prisma.topping.findUnique({
            where: { topping_id: id }
        });
    }
    static async create(data) {
        return prisma.topping.create({ data });
    }
    static async update(id, data) {
        return prisma.topping.update({
            where: { topping_id: id },
            data
        });
    }
    static async remove(id) {
        return prisma.topping.delete({
            where: { topping_id: id }
        });
    }
}
