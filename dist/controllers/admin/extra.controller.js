var _a;
import { ExtraService } from "../../services/admin/extra.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class ExtraController {
}
_a = ExtraController;
ExtraController.getAll = wrap(async (_req) => {
    const extras = await ExtraService.getAll();
    return extras;
});
ExtraController.getById = wrap(async (req) => {
    const id = req.params.id;
    const extra = await ExtraService.getById(id);
    if (!extra)
        throw fail('NOT_FOUND', 'Extra not found');
    return extra;
});
ExtraController.create = wrap(async (req) => {
    const extra = await ExtraService.create(req.body);
    return extra;
});
ExtraController.update = wrap(async (req) => {
    const id = req.params.id;
    const extra = await ExtraService.update(id, req.body);
    return extra;
});
ExtraController.remove = wrap(async (req) => {
    const id = req.params.id;
    await ExtraService.remove(id);
    return { success: true };
});
