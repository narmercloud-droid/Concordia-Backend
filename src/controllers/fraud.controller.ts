import { Request, Response, NextFunction } from "express";
import { fraudService } from "../services/fraud.service.js";
import { success, fail } from "./controllerHelper.js";
import { fraudScoreOrderBodySchema } from "../validation/fraud.schema.js";
import { orderIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const FraudController = {
  scoreOrder: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = fraudScoreOrderBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { orderId } = parsed.data;
      const result = await fraudService.scoreOrder(orderId);
      return success(res, result, "Order scored");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  getRisk: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const result = await fraudService.getRisk(parsed.data.orderId);
      return success(res, result, "Risk fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  flags: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flags = await fraudService.getFlags();
      return success(res, flags, "Flags listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  events: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const events = await fraudService.getOrderEvents(parsed.data.orderId);
      return success(res, events, "Events listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
