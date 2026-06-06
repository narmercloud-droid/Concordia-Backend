var _a;
import { ItemService } from "../../services/admin/item.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class ItemController {
}
_a = ItemController;
ItemController.getAll = wrap(async (_req) => {
    const items = await ItemService.getAll();
    return items;
});
ItemController.getById = wrap(async (req) => {
    const id = req.params.id;
    const item = await ItemService.getById(id);
    if (!item)
        throw fail('NOT_FOUND', 'Item not found');
    return item;
});
ItemController.create = wrap(async (req) => {
    const item = await ItemService.create(req.body);
    return item;
});
ItemController.update = wrap(async (req) => {
    const id = req.params.id;
    const item = await ItemService.update(id, req.body);
    return item;
});
ItemController.remove = wrap(async (req) => {
    const id = req.params.id;
    await ItemService.remove(id);
    return { success: true };
});
