import { prisma } from "../../prisma/client.js";

export class RelationService {
  static async getItemRelations(itemId: string, branchId?: string) {
    return prisma.relation.findMany({
      where: {
        itemId
      }
    });
  }
}
