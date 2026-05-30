import type { Request, Response, NextFunction  } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { success } from "./controllerHelper.js";

export const AnalyticsController = {
  totalRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.totalRevenue(branchId);
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  },

  ordersPerDay: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.ordersPerDay(branchId);
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  },

  bestSellingItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.bestSellingItems(branchId);
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  },

  customerStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.customerStats();
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.courierPerformance();
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  },

  hourlyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.hourlyOrders(branchId);
      return success(res, data);
    } catch (err: unknown) {
      next(err);
    }
  }
};






