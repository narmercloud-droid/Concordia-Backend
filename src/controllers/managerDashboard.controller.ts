import type { Request } from "express";
import { managerDashboardService } from "../services/managerDashboard.service.ts";
import { wrap } from "../contracts/api.js";

export const ManagerDashboardController = {
  menu: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    return await managerDashboardService.menu(branchId);
  }),

  setItemAvailability: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const { itemId, available } = req.body;
    await managerDashboardService.setItemAvailability(branchId, itemId, available);
    return { success: true };
  }),

  orders: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const status = req.query.status as string | undefined;
    return await managerDashboardService.orders(branchId, status);
  }),

  couriers: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    return await managerDashboardService.couriers(branchId);
  }),

  terminals: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    return await managerDashboardService.terminals(branchId);
  }),

  getSchedule: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    return await managerDashboardService.getSchedule(branchId);
  }),

  updateSchedule: wrap(async (req: Request) => {
    const branchId = (req as any).user.branchId;
    const schedule = req.body;
    await managerDashboardService.updateSchedule(branchId, schedule);
    return { success: true };
  })
};






