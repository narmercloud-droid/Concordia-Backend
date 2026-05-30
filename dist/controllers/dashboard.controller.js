import { dashboardService } from "../services/dashboard.service.js";
import { success } from "./controllerHelper.js";
export const DashboardController = {
    globalRevenue: async (req, res, next) => {
        try {
            return success(res, await dashboardService.globalRevenue());
        }
        catch (err) {
            next(err);
        }
    },
    branchRevenue: async (req, res, next) => {
        try {
            return success(res, await dashboardService.branchRevenue(req.params.branchId));
        }
        catch (err) {
            next(err);
        }
    },
    globalOrders: async (req, res, next) => {
        try {
            return success(res, await dashboardService.globalOrders());
        }
        catch (err) {
            next(err);
        }
    },
    branchOrders: async (req, res, next) => {
        try {
            return success(res, await dashboardService.branchOrders(req.params.branchId));
        }
        catch (err) {
            next(err);
        }
    },
    menuPerformance: async (req, res, next) => {
        try {
            return success(res, await dashboardService.menuPerformance(req.params.branchId));
        }
        catch (err) {
            next(err);
        }
    },
    courierPerformance: async (req, res, next) => {
        try {
            return success(res, await dashboardService.courierPerformance(req.params.branchId));
        }
        catch (err) {
            next(err);
        }
    },
    topSearches: async (req, res, next) => {
        try {
            return success(res, await dashboardService.topSearches());
        }
        catch (err) {
            next(err);
        }
    },
    loyaltyStats: async (req, res, next) => {
        try {
            return success(res, await dashboardService.loyaltyStats());
        }
        catch (err) {
            next(err);
        }
    },
    customerStats: async (req, res, next) => {
        try {
            return success(res, await dashboardService.customerStats());
        }
        catch (err) {
            next(err);
        }
    }
};
