import { RelationService } from "../../services/admin/relation.service.js";
import { success, fail } from "../controllerHelper.js";
import { itemIdParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class RelationController {
    static async getItemRelations(req, res, next) {
        try {
            const parsed = itemIdParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const relations = await RelationService.getItemRelations(parsed.data.itemId);
            return success(res, relations, "Relations fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
}
