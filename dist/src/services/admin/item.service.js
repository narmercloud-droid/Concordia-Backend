import { prisma } from "../../prisma/client.js";
export class ItemService {
    static async getAll() {
        return prisma.item.findMany({
            orderBy: { sort_order: "asc" },
            include: {
                relations: {
                    include: {
                        variants: { include: { variant: true } },
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
    }
    static async getById(id) {
        return prisma.item.findUnique({
            where: { item_id: id },
            include: {
                relations: {
                    include: {
                        variants: { include: { variant: true } },
                        toppings: { include: { topping: true } },
                        extras: { include: { extra: true } }
                    }
                }
            }
        });
    }
    static async create(data) {
        return prisma.item.create({ data });
    }
    static async update(id, data) {
        return prisma.item.update({
            where: { item_id: id },
            data
        });
    }
    static async remove(id) {
        return prisma.item.delete({
            where: { item_id: id }
        });
    }
}
