var _a;
import { DealService } from "../../services/admin/deal.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class DealController {
}
_a = DealController;
DealController.getAll = wrap(async (_req) => {
    const deals = await DealService.getAll();
    return deals;
});
DealController.getById = wrap(async (req) => {
    const id = req.params.id;
    const deal = await DealService.getById(id);
    if (!deal)
        throw fail('NOT_FOUND', 'Deal not found');
    return deal;
});
DealController.create = wrap(async (req) => {
    const deal = await DealService.create(req.body);
    return deal;
});
DealController.update = wrap(async (req) => {
    const id = req.params.id;
    const deal = await DealService.update(id, req.body);
    return deal;
});
DealController.remove = wrap(async (req) => {
    const id = req.params.id;
    await DealService.remove(id);
    return { success: true };
});
