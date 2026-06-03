var _a;
import { RelationService } from "../../services/admin/relation.service.js";
import { wrap } from "../../contracts/api.js";
export class RelationController {
}
_a = RelationController;
RelationController.getItemRelations = wrap(async (req) => {
    const itemId = req.params.itemId;
    const relations = await RelationService.getItemRelations(itemId);
    return relations;
});
