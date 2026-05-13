import { analyticsService } from "../services/analytics.service.js";
export const AnalyticsController = {
    totalRevenue: async (req, res, next) => {
        try {
            const data = await analyticsService.totalRevenue(req.query.branchId);
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    },
    ordersPerDay: async (req, res, next) => {
        try {
            const data = await analyticsService.ordersPerDay(req.query.branchId);
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    },
    bestSellingItems: async (req, res, next) => {
        try {
            const data = await analyticsService.bestSellingItems(req.query.branchId);
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    },
    customerStats: async (req, res, next) => {
        try {
            const data = await analyticsService.customerStats();
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    },
    courierPerformance: async (req, res, next) => {
        try {
            const data = await analyticsService.courierPerformance();
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    },
    hourlyOrders: async (req, res, next) => {
        try {
            const data = await analyticsService.hourlyOrders(req.query.branchId);
            res.json(data);
        }
        catch (err) {
            next(err);
        }
    }
};
