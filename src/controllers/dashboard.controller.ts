import type { Request, Response, NextFunction  } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { success } from "./controllerHelper.js";

export const DashboardController = {
  globalRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.globalRevenue());
    } catch (err: unknown) {
      next(err);
    }
  },

  branchRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.branchRevenue(req.params.branchId));
    } catch (err: unknown) {
      next(err);
    }
  },

  globalOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.globalOrders());
    } catch (err: unknown) {
      next(err);
    }
  },

  branchOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.branchOrders(req.params.branchId));
    } catch (err: unknown) {
      next(err);
    }
  },

  menuPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.menuPerformance(req.params.branchId));
    } catch (err: unknown) {
      next(err);
    }
  },

  courierPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.courierPerformance(req.params.branchId));
    } catch (err: unknown) {
      next(err);
    }
  },

  topSearches: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.topSearches());
    } catch (err: unknown) {
      next(err);
    }
  },

  loyaltyStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.loyaltyStats());
    } catch (err: unknown) {
      next(err);
    }
  },

  customerStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return success(res, await dashboardService.customerStats());
    } catch (err: unknown) {
      next(err);
    }
  }
};






