import type { Request } from "express";
import { DealService } from "../../services/admin/deal.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class DealController {
  static getAll = wrap(async (_req: Request) => {
    const deals = await DealService.getAll();
    return deals;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const deal = await DealService.getById(id);

    if (!deal) throw fail('NOT_FOUND', 'Deal not found');

    return deal;
  });

  static create = wrap(async (req: Request) => {
    const deal = await DealService.create(req.body);
    return deal;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const deal = await DealService.update(id, req.body);
    return deal;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await DealService.remove(id);
    return { success: true };
  });
}





