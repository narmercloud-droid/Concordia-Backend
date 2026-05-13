import { RelationService } from "../../services/admin/relation.service.js";
export class RelationController {
    static async getItemRelations(req, res, next) {
        try {
            const itemId = req.params.itemId;
            const relations = await RelationService.getItemRelations(itemId);
            res.json(relations);
        }
        catch (err) {
            next(err);
        }
    }
}
