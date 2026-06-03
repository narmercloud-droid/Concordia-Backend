import { dashboardService } from "../services/dashboard.service.js";
import { wrap } from "../contracts/api.js";
export const DashboardController = {
    globalRevenue: wrap(async () => {
        return await dashboardService.globalRevenue();
    }),
    branchRevenue: wrap(async (req) => {
        return await dashboardService.branchRevenue(req.params.branchId);
    }),
    globalOrders: wrap(async () => {
        return await dashboardService.globalOrders();
    }),
    branchOrders: wrap(async (req) => {
        return await dashboardService.branchOrders(req.params.branchId);
    }),
    menuPerformance: wrap(async (req) => {
        return await dashboardService.menuPerformance(req.params.branchId);
    }),
    courierPerformance: wrap(async (req) => {
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
