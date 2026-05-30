import type { Request, Response, NextFunction  } from "express";
import { PrintService } from "../../services/print/print.service.js";
import { success } from "../controllerHelper.js";

export class PrintController {
  static async printOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await PrintService.printOrder(id);

      return success(res, { success: true, message: "Printed successfully" });
    } catch (err: unknown) {
      next(err);
    }
  }
}






