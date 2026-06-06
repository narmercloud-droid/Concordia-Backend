import { prisma } from "../../prisma/client.js";
export class RelationService {
    static async getItemRelations(itemId) {
        return prisma.relation.findMany({
            where: { itemId },
        });
    }
}
