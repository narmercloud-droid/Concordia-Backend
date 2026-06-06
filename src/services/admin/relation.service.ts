import { prisma } from "../../prisma/client.ts";

export class RelationService {
  static async getItemRelations(itemId: string) {
    return prisma.relation.findMany({
      where: { itemId },
    });
  }
}




