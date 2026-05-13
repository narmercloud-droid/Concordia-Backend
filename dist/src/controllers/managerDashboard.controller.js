import { managerDashboardService } from "../services/managerDashboard.service.js";
export const ManagerDashboardController = {
    menu: async (req, res, next) => {
        const branchId = req.user.branchId;
        res.json(await managerDashboardService.menu(branchId));
    },
    setItemAvailability: async (req, res, next) => {
        const branchId = req.user.branchId;
        const { itemId, available } = req.body;
        await managerDashboardService.setItemAvailability(branchId, itemId, available);
        res.json({ success: true });
    },
    orders: async (req, res, next) => {
        const branchId = req.user.branchId;
        const { status } = req.query;
        res.json(await managerDashboardService.orders(branchId, status));
    },
    couriers: async (req, res, next) => {
        const branchId = req.user.branchId;
        res.json(await managerDashboardService.couriers(branchId));
    },
    terminals: async (req, res, next) => {
        const branchId = req.user.branchId;
        res.json(await managerDashboardService.terminals(branchId));
    },
    getSchedule: async (req, res, next) => {
        const branchId = req.user.branchId;
        res.json(await managerDashboardService.getSchedule(branchId));
    },
    updateSchedule: async (req, res, next) => {
        const branchId = req.user.branchId;
        const schedule = req.body;
        await managerDashboardService.updateSchedule(branchId, schedule);
        res.json({ success: true });
    }
};
