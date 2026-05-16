import { Request, Response, NextFunction } from "express";
import { RelationService } from "../../services/admin/relation.service.js";

export class RelationController {
  static async getItemRelations(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = req.params.itemId;
      const relations = await RelationService.getItemRelations(itemId);
      res.json(relations);
    } catch (err: unknown) {
      next(err);
    }
  }
}
