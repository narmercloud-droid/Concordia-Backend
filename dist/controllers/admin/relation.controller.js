import { RelationService } from "../../services/admin/relation.service.js";
import { success } from "../controllerHelper.js";
export class RelationController {
    static async getItemRelations(req, res, next) {
        try {
            const itemId = req.params.itemId;
            const relations = await RelationService.getItemRelations(itemId);
            return success(res, relations);
        }
        catch (err) {
            next(err);
        }
    }
}
