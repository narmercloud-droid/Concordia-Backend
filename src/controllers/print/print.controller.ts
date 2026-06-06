import type { Request } from "express";
import { PrintService } from "../../services/print/print.service.ts";
import { wrap } from "../../contracts/api.js";

export class PrintController {
  static printOrder = wrap(async (req: Request) => {
    const { id } = req.params;
    await PrintService.printOrder(id);
    return { success: true, message: "Printed successfully" };
  });
}






