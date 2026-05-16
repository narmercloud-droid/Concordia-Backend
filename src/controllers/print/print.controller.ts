import { Request, Response, NextFunction } from "express";
import { PrintService } from "../../services/print/print.service.js";

export class PrintController {
  static async printOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await PrintService.printOrder(id);

      res.json({ success: true, message: "Printed successfully" });
    } catch (err: unknown) {
      next(err);
    }
  }
}

