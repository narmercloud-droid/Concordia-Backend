import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { success, fail } from "./controllerHelper.js";
import { branchIdParamSchema } from "../validation/common.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const DashboardController = {
  globalRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.globalRevenue();
      return success(res, data, "Global revenue fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branchRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = branchIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const data = await dashboardService.branchRevenue(parsed.data.branchId);
      return success(res, data, "Branch revenue fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  globalOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.globalOrders();
      return success(res, data, "Global orders fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  branchOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = branchIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const data = await dashboardService.branchOrders(parsed.data.branchId);
      return success(res, data, "Branch orders fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  menuPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = branchIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const data = await dashboardService.menuPerformance(parsed.data.branchId);
      return success(res, data, "Menu performance fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  courierPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = branchIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const data = await dashboardService.courierPerformance(parsed.data.branchId);
      return success(res, data, "Courier performance fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  topSearches: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.topSearches();
      return success(res, data, "Top searches fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  loyaltyStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.loyaltyStats();
      return success(res, data, "Loyalty stats fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  customerStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.customerStats();
      return success(res, data, "Customer stats fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
