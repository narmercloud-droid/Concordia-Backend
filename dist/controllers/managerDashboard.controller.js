import { managerDashboardService } from "../services/managerDashboard.service.js";
import { success } from "./controllerHelper.js";
export const ManagerDashboardController = {
    menu: async (req, res, next) => {
        const branchId = req.user.branchId;
        return success(res, await managerDashboardService.menu(branchId));
    },
    setItemAvailability: async (req, res, next) => {
        const branchId = req.user.branchId;
        const { itemId, available } = req.body;
        await managerDashboardService.setItemAvailability(branchId, itemId, available);
        return success(res, { success: true });
    },
    orders: async (req, res, next) => {
        const branchId = req.user.branchId;
        const status = req.query.status;
        return success(res, await managerDashboardService.orders(branchId, status));
    },
    couriers: async (req, res, next) => {
        const branchId = req.user.branchId;
        return success(res, await managerDashboardService.couriers(branchId));
    },
    terminals: async (req, res, next) => {
        const branchId = req.user.branchId;
        return success(res, await managerDashboardService.terminals(branchId));
    },
    getSchedule: async (req, res, next) => {
        const branchId = req.user.branchId;
        return success(res, await managerDashboardService.getSchedule(branchId));
    },
    updateSchedule: async (req, res, next) => {
        const branchId = req.user.branchId;
        const schedule = req.body;
        await managerDashboardService.updateSchedule(branchId, schedule);
        return success(res, { success: true });
    }
};
