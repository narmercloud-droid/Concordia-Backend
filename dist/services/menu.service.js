"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const client_1 = require("../prisma/client");
class MenuService {
    static async getFullMenu() {
        const categories = await client_1.prisma.category.findMany({
            orderBy: { sort_order: "asc" },
            include: {
                items: {
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
                }
            }
        });
        const deals = await client_1.prisma.deal.findMany({
            orderBy: { sort_order: "asc" },
            include: {
                items_included: {
                    include: { item: true }
                }
            }
        });
        return { categories, deals };
    }
}
exports.MenuService = MenuService;
