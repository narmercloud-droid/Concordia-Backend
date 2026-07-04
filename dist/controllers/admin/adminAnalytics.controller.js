import { wrap } from "../../contracts/api.js";
import { getBranchPerformanceSeries, getCategoryPerformanceSeries, getOrderVolumeSeries, getPeakHoursSeries, getSalesSeries, getTopItemsSeries } from "../../services/admin/adminAnalytics.service.js";
import { resolveManagerBranchId } from "../../middleware/managerAccess.js";
function branchIdFromRequest(req) {
    return resolveManagerBranchId(req) ?? undefined;
}
export const AdminAnalyticsController = {
    sales: wrap(async (req) => getSalesSeries(7, branchIdFromRequest(req))),
    orderVolume: wrap(async (req) => getOrderVolumeSeries(7, branchIdFromRequest(req))),
    categoryPerformance: wrap(async (req) => getCategoryPerformanceSeries(branchIdFromRequest(req))),
    branchPerformance: wrap(async (req) => getBranchPerformanceSeries(branchIdFromRequest(req))),
    peakHours: wrap(async (req) => getPeakHoursSeries(branchIdFromRequest(req))),
    topItems: wrap(async (req) => getTopItemsSeries(branchIdFromRequest(req)))
};
