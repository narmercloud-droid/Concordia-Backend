"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealService = void 0;
const client_1 = require("../../prisma/client");
class DealService {
    static async getAll() {
        return client_1.prisma.deal.findMany({
            orderBy: { sort_order: "asc" },
            include: {
                items_included: {
                    include: { item: true }
                }
            }
        });
    }
    static async getById(id) {
        return client_1.prisma.deal.findUnique({
            where: { deal_id: id },
            include: {
                items_included: {
                    include: { item: true }
                }
            }
        });
    }
    static async create(data) {
        return client_1.prisma.deal.create({ data });
    }
    static async update(id, data) {
        return client_1.prisma.deal.update({
            where: { deal_id: id },
            data
        });
    }
    static async remove(id) {
        return client_1.prisma.deal.delete({
            where: { deal_id: id }
        });
    }
    // Add item to deal
    static async addItem(dealId, itemId) {
        return client_1.prisma.dealItem.create({
            data: {
                deal_id: dealId,
                item_id: itemId
            }
        });
    }
    // Remove item from deal
    static async removeItem(dealId, itemId) {
        return client_1.prisma.dealItem.deleteMany({
            where: {
                deal_id: dealId,
                item_id: itemId
            }
        });
    }
}
exports.DealService = DealService;
