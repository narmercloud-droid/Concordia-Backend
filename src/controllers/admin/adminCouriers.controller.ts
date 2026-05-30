import type { Request, Response, NextFunction  } from "express";
import { AdminCouriersService } from "../../services/admin/adminCouriers.service.js";
import { success, fail } from "../controllerHelper.js";
import { adminCourierCreateSchema, adminCourierUpdateSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class AdminCouriersController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const couriers = await AdminCouriersService.getAll(branchId);
      return success(res, couriers, "Couriers fetched");
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
      const courier = await AdminCouriersService.getById(parsed.data.id, branchId);
      if (!courier) {
        return fail(res, "NOT_FOUND", "Courier not found", 404);
      }
      return success(res, courier, "Courier fetched");
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
      const parsed = adminCourierCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const courier = await AdminCouriersService.create(branchId, parsed.data);
      return success(res, courier, "Courier created", 201);
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
      const parsedBody = adminCourierUpdateSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
      }
      const courier = await AdminCouriersService.update(parsedParams.data.id, branchId, parsedBody.data);
      return success(res, courier, "Courier updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const courier = await AdminCouriersService.toggleActive(parsed.data.id, branchId);
      return success(res, courier, "Courier status toggled");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }

  static async getOrderHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const branchId = req.user?.branchId;
      if (!branchId) {
        return fail(res, "MISSING_BRANCH", "Branch ID is required", 400);
      }
      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const orders = await AdminCouriersService.getOrderHistory(parsed.data.id, branchId);
      return success(res, orders, "Order history fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
}




