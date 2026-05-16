import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { success, fail } from "./controllerHelper.js";
import { analyticsBranchQuerySchema } from "../validation/analytics.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const AnalyticsController = {
  totalRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = analyticsBranchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;
      const data = await analyticsService.totalRevenue(branchId);
      return success(res, data, "Total revenue fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  ordersPerDay: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = analyticsBranchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;
      const data = await analyticsService.ordersPerDay(branchId);
      return success(res, data, "Orders per day fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  bestSellingItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = analyticsBranchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;
      const data = await analyticsService.bestSellingItems(branchId);
      return success(res, data, "Best selling items fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  customerStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.customerStats();
      return success(res, data, "Customer stats fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  courierPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.courierPerformance();
      return success(res, data, "Courier performance fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  hourlyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = analyticsBranchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { branchId } = parsed.data;
      const data = await analyticsService.hourlyOrders(branchId);
      return success(res, data, "Hourly orders fetched successfully");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};

