import { Request, Response, NextFunction } from "express";
import { VariantService } from "../../services/admin/variant.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminEntityBodySchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class VariantController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const variants = await VariantService.getAll(branchId);
      return success(res, variants, "Variants listed");
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
      const variant = await VariantService.getById(parsed.data.id, branchId);

      if (!variant) {
        return fail(res, "NOT_FOUND", "Variant not found", 404);
      }

      return success(res, variant, "Variant fetched");
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
      const variant = await VariantService.create(branchId, parsed.data);
      return success(res, variant, "Variant created", 201);
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
      const variant = await VariantService.update(parsedParams.data.id, branchId, parsedBody.data);
      return success(res, variant, "Variant updated");
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
      await VariantService.remove(parsed.data.id, branchId);
      return success(res, { success: true }, "Variant removed");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}
