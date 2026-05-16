import { prisma } from "../../prisma/client.js";
export class RelationService {
    static async getItemRelations(itemId, branchId) {
        return prisma.relation.findMany({
            where: {
                itemId
            }
        });
    }
}
