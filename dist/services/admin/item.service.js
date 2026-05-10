"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
const client_1 = require("../../prisma/client");
class ItemService {
    static async getAll() {
        return client_1.prisma.item.findMany({
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
        return client_1.prisma.item.findUnique({
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
        return client_1.prisma.item.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.item.update({
            where: { item_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.item.delete({
            where: { item_id: id }
        });
    }
}
exports.ItemService = ItemService;
