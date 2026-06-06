import type { Request } from "express";
import { RelationService } from "../../services/admin/relation.service.ts";
import { wrap } from "../../contracts/api.js";

export class RelationController {
  static getItemRelations = wrap(async (req: Request) => {
    const itemId = req.params.itemId;
    const relations = await RelationService.getItemRelations(itemId);
    return relations;
  });
}





