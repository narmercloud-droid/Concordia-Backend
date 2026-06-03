import { analyticsService } from "../services/analytics.service.js";
import { wrap } from "../contracts/api.js";
export const AnalyticsController = {
    totalRevenue: wrap(async (req) => {
        const branchId = req.query.branchId;
        const data = await analyticsService.totalRevenue(branchId);
        return data;
    }),
    ordersPerDay: wrap(async (req) => {
        const branchId = req.query.branchId;
        const data = await analyticsService.ordersPerDay(branchId);
        return data;
    }),
    bestSellingItems: wrap(async (req) => {
        const branchId = req.query.branchId;
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
    hourlyOrders: wrap(async (req) => {
        const branchId = req.query.branchId;
        const data = await analyticsService.hourlyOrders(branchId);
        return data;
    })
};
