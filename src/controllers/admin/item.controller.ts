import type { Request } from "express";
import { ItemService } from "../../services/admin/item.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class ItemController {
  static getAll = wrap(async (_req: Request) => {
    const items = await ItemService.getAll();
    return items;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const item = await ItemService.getById(id);

    if (!item) throw fail('NOT_FOUND', 'Item not found');

    return item;
  });

  static create = wrap(async (req: Request) => {
    const item = await ItemService.create(req.body);
    return item;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const item = await ItemService.update(id, req.body);
    return item;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await ItemService.remove(id);
    return { success: true };
  });
}





