import type { Request, Response, NextFunction  } from "express";
import { managerDashboardService } from "../services/managerDashboard.service.js";
import { success } from "./controllerHelper.js";

export const ManagerDashboardController = {
  menu: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    return success(res, await managerDashboardService.menu(branchId));
  },

  setItemAvailability: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const { itemId, available } = req.body;
    await managerDashboardService.setItemAvailability(branchId, itemId, available);
    return success(res, { success: true });
  },

  orders: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const status = req.query.status as string | undefined;
    return success(res, await managerDashboardService.orders(branchId, status));
  },

  couriers: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    return success(res, await managerDashboardService.couriers(branchId));
  },

  terminals: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    return success(res, await managerDashboardService.terminals(branchId));
  },

  getSchedule: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    return success(res, await managerDashboardService.getSchedule(branchId));
  },

  updateSchedule: async (req: Request, res: Response, next: NextFunction) => {
    const branchId = req.user.branchId;
    const schedule = req.body;
    await managerDashboardService.updateSchedule(branchId, schedule);
    return success(res, { success: true });
  }
};






