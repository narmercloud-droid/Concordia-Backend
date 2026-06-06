import type { Request  } from "express";
import { analyticsService } from "../services/analytics.service.ts";
import { wrap } from "../contracts/api.js";

export const AnalyticsController = {
  totalRevenue: wrap(async (req: Request) => {
    const branchId = req.query.branchId as string;
    const data = await analyticsService.totalRevenue(branchId);
    return data;
  }),

  ordersPerDay: wrap(async (req: Request) => {
    const branchId = req.query.branchId as string;
    const data = await analyticsService.ordersPerDay(branchId);
    return data;
  }),

  bestSellingItems: wrap(async (req: Request) => {
    const branchId = req.query.branchId as string;
    const data = await analyticsService.bestSellingItems(branchId);
    return data;
  }),

  customerStats: wrap(async () => {
    const data = await analyticsService.customerStats();
    return data;
  }),

  courierPerformance: wrap(async () => {
    const data = await analyticsService.courierPerformance();
    return data;
  }),

  hourlyOrders: wrap(async (req: Request) => {
    const branchId = req.query.branchId as string;
    const data = await analyticsService.hourlyOrders(branchId);
    return data;
  })
};






