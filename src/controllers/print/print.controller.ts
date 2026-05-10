import { Request, Response } from "express";
import { PrintService } from "../../services/print/print.service";

export class PrintController {
  static async printOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await PrintService.printOrder(id);

      res.json({ success: true, message: "Printed successfully" });
    } catch (err: any) {
      console.error("Print error:", err);
      res.status(500).json({ error: "Print failed" });
    }
  }
}
