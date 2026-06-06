var _a;
import { VariantService } from "../../services/admin/variant.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class VariantController {
}
_a = VariantController;
VariantController.getAll = wrap(async (_req) => {
    const variants = await VariantService.getAll();
    return variants;
});
VariantController.getById = wrap(async (req) => {
    const id = req.params.id;
    const variant = await VariantService.getById(id);
    if (!variant)
        throw fail('NOT_FOUND', 'Variant not found');
    return variant;
});
VariantController.create = wrap(async (req) => {
    const variant = await VariantService.create(req.body);
    return variant;
});
VariantController.update = wrap(async (req) => {
    const id = req.params.id;
    const variant = await VariantService.update(id, req.body);
    return variant;
});
VariantController.remove = wrap(async (req) => {
    const id = req.params.id;
    await VariantService.remove(id);
    return { success: true };
});
