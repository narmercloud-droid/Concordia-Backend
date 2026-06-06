var _a;
import { CategoryService } from "../../services/admin/category.service.js";
import { wrap, fail } from "../../contracts/api.js";
export class CategoryController {
}
_a = CategoryController;
CategoryController.getAll = wrap(async (_req) => {
    const categories = await CategoryService.getAll();
    return categories;
});
CategoryController.getById = wrap(async (req) => {
    const id = req.params.id;
    const category = await CategoryService.getById(id);
    if (!category)
        throw fail('NOT_FOUND', 'Category not found');
    return category;
});
CategoryController.create = wrap(async (req) => {
    const category = await CategoryService.create(req.body);
    return category;
});
CategoryController.update = wrap(async (req) => {
    const id = req.params.id;
    const category = await CategoryService.update(id, req.body);
    return category;
});
CategoryController.remove = wrap(async (req) => {
    const id = req.params.id;
    await CategoryService.remove(id);
    return { success: true };
});
