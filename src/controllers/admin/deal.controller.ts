import { Request, Response, NextFunction } from "express";
import { DealService } from "../../services/admin/deal.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminEntityBodySchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class DealController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const deals = await DealService.getAll(branchId);
      return success(res, deals, "Deals listed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const deal = await DealService.getById(parsed.data.id, branchId);

      if (!deal) {
        return fail(res, "NOT_FOUND", "Deal not found", 404);
      }

      return success(res, deal, "Deal fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsed = adminEntityBodySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const deal = await DealService.create(branchId, parsed.data);
      return success(res, deal, "Deal created", 201);
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsedParams = idParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
      }
      const parsedBody = adminEntityBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const deal = await DealService.update(parsedParams.data.id, branchId, parsedBody.data);
      return success(res, deal, "Deal updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      await DealService.remove(parsed.data.id, branchId);
      return success(res, { success: true }, "Deal removed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
