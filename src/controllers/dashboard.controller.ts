import type { Request  } from "express";
import { dashboardService } from "../services/dashboard.service.ts";
import { wrap } from "../contracts/api.js";

export const DashboardController = {
  globalRevenue: wrap(async () => {
    return await dashboardService.globalRevenue();
  }),

  branchRevenue: wrap(async (req: Request) => {
    return await dashboardService.branchRevenue(req.params.branchId);
  }),

  globalOrders: wrap(async () => {
    return await dashboardService.globalOrders();
  }),

  branchOrders: wrap(async (req: Request) => {
    return await dashboardService.branchOrders(req.params.branchId);
  }),

  menuPerformance: wrap(async (req: Request) => {
    return await dashboardService.menuPerformance(req.params.branchId);
  }),

  courierPerformance: wrap(async (req: Request) => {
    return await dashboardService.courierPerformance(req.params.branchId);
  }),

  topSearches: wrap(async () => {
    return await dashboardService.topSearches();
  }),

  loyaltyStats: wrap(async () => {
    return await dashboardService.loyaltyStats();
  }),

  customerStats: wrap(async () => {
    return await dashboardService.customerStats();
  })
};






