import type { Request } from "express";
import { ExtraService } from "../../services/admin/extra.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class ExtraController {
  static getAll = wrap(async (_req: Request) => {
    const extras = await ExtraService.getAll();
    return extras;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const extra = await ExtraService.getById(id);

    if (!extra) throw fail('NOT_FOUND', 'Extra not found');

    return extra;
  });

  static create = wrap(async (req: Request) => {
    const extra = await ExtraService.create(req.body);
    return extra;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const extra = await ExtraService.update(id, req.body);
    return extra;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await ExtraService.remove(id);
    return { success: true };
  });
}





