"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationService = void 0;
const client_1 = require("../../prisma/client");
class RelationService {
    // Get all relations for an item
    static async getItemRelations(itemId) {
        return client_1.prisma.item.findUnique({
            where: { item_id: itemId },
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
    // Assign variant to relation
    static async addVariant(relationId, variantId) {
        return client_1.prisma.relationVariant.create({
            data: {
                relation_id: relationId,
                variant_id: variantId
            }
        });
    }
    // Assign topping to relation
    static async addTopping(relationId, toppingId) {
        return client_1.prisma.relationTopping.create({
            data: {
                relation_id: relationId,
                topping_id: toppingId
            }
        });
    }
    // Assign extra to relation
    static async addExtra(relationId, extraId) {
        return client_1.prisma.relationExtra.create({
            data: {
                relation_id: relationId,
                extra_id: extraId
            }
        });
    }
    // Remove variant
    static async removeVariant(relationId, variantId) {
        return client_1.prisma.relationVariant.deleteMany({
            where: { relation_id: relationId, variant_id: variantId }
        });
    }
    // Remove topping
    static async removeTopping(relationId, toppingId) {
        return client_1.prisma.relationTopping.deleteMany({
            where: { relation_id: relationId, topping_id: toppingId }
        });
    }
    // Remove extra
    static async removeExtra(relationId, extraId) {
        return client_1.prisma.relationExtra.deleteMany({
            where: { relation_id: relationId, extra_id: extraId }
        });
    }
}
exports.RelationService = RelationService;
