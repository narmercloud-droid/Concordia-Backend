import { analyticsService } from "../services/analytics.service.js";
import { success } from "./controllerHelper.js";
export const AnalyticsController = {
    totalRevenue: async (req, res, next) => {
        try {
            const branchId = req.query.branchId;
            const data = await analyticsService.totalRevenue(branchId);
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    ordersPerDay: async (req, res, next) => {
        try {
            const branchId = req.query.branchId;
            const data = await analyticsService.ordersPerDay(branchId);
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    bestSellingItems: async (req, res, next) => {
        try {
            const branchId = req.query.branchId;
            const data = await analyticsService.bestSellingItems(branchId);
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    customerStats: async (req, res, next) => {
        try {
            const data = await analyticsService.customerStats();
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    courierPerformance: async (req, res, next) => {
        try {
            const data = await analyticsService.courierPerformance();
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    },
    hourlyOrders: async (req, res, next) => {
        try {
            const branchId = req.query.branchId;
            const data = await analyticsService.hourlyOrders(branchId);
            return success(res, data);
        }
        catch (err) {
            next(err);
        }
    }
};
