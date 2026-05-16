import { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../globalTypes.js";
import { managerDashboardService } from "../services/managerDashboard.service.js";
import { success, fail } from "./controllerHelper.js";
import {
  managerItemAvailabilitySchema,
  managerScheduleUpdateSchema,
  managerOrdersQuerySchema
} from "../validation/managerDashboard.schema.js";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export const ManagerDashboardController = {
  menu: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const data = await managerDashboardService.menu(branchId);
      return success(res, data, "Manager menu loaded");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  setItemAvailability: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = managerItemAvailabilitySchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const branchId = req.user!.branchId;
      const { itemId, available } = parsed.data;
      await managerDashboardService.setItemAvailability(branchId, itemId, available);
      return success(res, { success: true }, "Item availability updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  orders: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const parsed = managerOrdersQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const { status } = parsed.data;
      const data = await managerDashboardService.orders(branchId, status);
      return success(res, data, "Orders fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  couriers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const data = await managerDashboardService.couriers(branchId);
      return success(res, data, "Couriers fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  terminals: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const data = await managerDashboardService.terminals(branchId);
      return success(res, data, "Terminals fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  getSchedule: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const branchId = req.user!.branchId;
      const data = await managerDashboardService.getSchedule(branchId);
      return success(res, data, "Schedule fetched");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  },

  updateSchedule: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = managerScheduleUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
      }
      const branchId = req.user!.branchId;
      await managerDashboardService.updateSchedule(branchId, parsed.data as any);
      return success(res, { success: true }, "Schedule updated");
    } catch (err: unknown) {
      return fail(res, "UNKNOWN_ERROR", (err as Error).message, 500);
    }
  }
};
