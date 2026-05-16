import { Request, Response, NextFunction } from "express";
import { RelationService } from "../../services/admin/relation.service.js";
import { success, fail } from "../controllerHelper.js";
import { itemIdParamSchema } from "../../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class RelationController {
  static async getItemRelations(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = itemIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const relations = await RelationService.getItemRelations(parsed.data.itemId);
      return success(res, relations, "Relations fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
