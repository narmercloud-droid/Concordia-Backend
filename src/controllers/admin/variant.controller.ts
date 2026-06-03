import type { Request  } from "express";
import { VariantService } from "../../services/admin/variant.service.ts";
import { wrap, fail } from "../../contracts/api.js";

export class VariantController {
  static getAll = wrap(async (_req: Request) => {
    const variants = await VariantService.getAll();
    return variants;
  });

  static getById = wrap(async (req: Request) => {
    const id = req.params.id;
    const variant = await VariantService.getById(id);

    if (!variant) throw fail('NOT_FOUND', 'Variant not found');

    return variant;
  });

  static create = wrap(async (req: Request) => {
    const variant = await VariantService.create(req.body);
    return variant;
  });

  static update = wrap(async (req: Request) => {
    const id = req.params.id;
    const variant = await VariantService.update(id, req.body);
    return variant;
  });

  static remove = wrap(async (req: Request) => {
    const id = req.params.id;
    await VariantService.remove(id);
    return { success: true };
  });
}





