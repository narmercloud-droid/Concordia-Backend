import { prisma } from "../../prisma/client.js";
export class DealService {
    static async getAll() {
        return prisma.deal.findMany({
            orderBy: { sort_order: "asc" },
            include: {
                items_included: {
                    include: { item: true }
                }
            }
        });
    }
    static async getById(id) {
        return prisma.deal.findUnique({
            where: { deal_id: id },
            include: {
                items_included: {
                    include: { item: true }
                }
            }
        });
    }
    static async create(data) {
        return prisma.deal.create({ data });
    }
    static async update(id, data) {
        return prisma.deal.update({
            where: { deal_id: id },
            data
        });
    }
    static async remove(id) {
        return prisma.deal.delete({
            where: { deal_id: id }
        });
    }
    // Add item to deal
    static async addItem(dealId, itemId) {
        return prisma.dealItem.create({
            data: {
                deal_id: dealId,
                item_id: itemId
            }
        });
    }
    // Remove item from deal
    static async removeItem(dealId, itemId) {
        return prisma.dealItem.deleteMany({
            where: {
                deal_id: dealId,
                item_id: itemId
            }
        });
    }
}
