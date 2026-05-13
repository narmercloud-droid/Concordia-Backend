import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service.js";

export const AnalyticsController = {
  totalRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.totalRevenue(branchId);
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  },

  ordersPerDay: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.ordersPerDay(branchId);
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  },

  bestSellingItems: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.bestSellingItems(branchId);
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  },

  customerStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.customerStats();
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  },

  courierPerformance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await analyticsService.courierPerformance();
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  },

  hourlyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.query.branchId as string;
      const data = await analyticsService.hourlyOrders(branchId);
      res.json(data);
    } catch (err: unknown) {
      next(err);
    }
  }
};

