var _a;
import { ToppingService } from "../../services/admin/topping.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class ToppingController {
}
_a = ToppingController;
ToppingController.getAll = wrap(async (_req) => {
    const toppings = await ToppingService.getAll();
    return toppings;
});
ToppingController.getById = wrap(async (req) => {
    const id = req.params.id;
    const topping = await ToppingService.getById(id);
    if (!topping)
        throw fail('NOT_FOUND', 'Topping not found');
    return topping;
});
ToppingController.create = wrap(async (req) => {
    const topping = await ToppingService.create(req.body);
    return topping;
});
ToppingController.update = wrap(async (req) => {
    const id = req.params.id;
    const topping = await ToppingService.update(id, req.body);
    return topping;
});
ToppingController.remove = wrap(async (req) => {
    const id = req.params.id;
    await ToppingService.remove(id);
    return { success: true };
});
