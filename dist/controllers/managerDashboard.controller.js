import { managerDashboardService } from "../services/managerDashboard.service.js";
import { wrap } from "../contracts/api.js";
export const ManagerDashboardController = {
    menu: wrap(async (req) => {
        const branchId = req.user.branchId;
        return await managerDashboardService.menu(branchId);
    }),
    setItemAvailability: wrap(async (req) => {
        const branchId = req.user.branchId;
        const { itemId, available } = req.body;
        await managerDashboardService.setItemAvailability(branchId, itemId, available);
        return { success: true };
    }),
    orders: wrap(async (req) => {
        const branchId = req.user.branchId;
        const status = req.query.status;
        return await managerDashboardService.orders(branchId, status);
    }),
    couriers: wrap(async (req) => {
        const branchId = req.user.branchId;
        return await managerDashboardService.couriers(branchId);
    }),
    terminals: wrap(async (req) => {
        const branchId = req.user.branchId;
        return await managerDashboardService.terminals(branchId);
    }),
    getSchedule: wrap(async (req) => {
        const branchId = req.user.branchId;
        return await managerDashboardService.getSchedule(branchId);
    }),
    updateSchedule: wrap(async (req) => {
        const branchId = req.user.branchId;
        const schedule = req.body;
        await managerDashboardService.updateSchedule(branchId, schedule);
        return { success: true };
    })
};
