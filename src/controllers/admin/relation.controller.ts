import type { Request, Response, NextFunction  } from "express";
import { RelationService } from "../../services/admin/relation.service.js";
import { success } from "../controllerHelper.js";

export class RelationController {
  static async getItemRelations(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = req.params.itemId;
      const relations = await RelationService.getItemRelations(itemId);
      return success(res, relations);
    } catch (err: unknown) {
      next(err);
    }
  }
}





