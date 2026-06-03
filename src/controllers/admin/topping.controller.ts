import type { Request } from "express";
import { ToppingService } from "../../services/admin/topping.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class ToppingController {
  static getAll = wrap(async (_req: Request) => {
    const toppings = await ToppingService.getAll();
    return toppings;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const topping = await ToppingService.getById(id);

    if (!topping) throw fail('NOT_FOUND', 'Topping not found');

    return topping;
  });

  static create = wrap(async (req: Request) => {
    const topping = await ToppingService.create(req.body);
    return topping;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const topping = await ToppingService.update(id, req.body);
    return topping;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await ToppingService.remove(id);
    return { success: true };
  });
}





