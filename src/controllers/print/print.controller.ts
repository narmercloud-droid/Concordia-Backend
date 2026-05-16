import { Request, Response, NextFunction } from "express";
import { PrintService } from "../../services/print/print.service.js";
import { success, fail } from "../controllerHelper.js";
import { idParamSchema } from "../../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class PrintController {
  static async printOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }

      await PrintService.printOrder(parsed.data.id);

      return success(res, { success: true, message: "Printed successfully" }, "Printed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
