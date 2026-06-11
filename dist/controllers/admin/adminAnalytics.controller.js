import { wrap } from "../../contracts/api.js";
import { getBranchPerformanceSeries, getCategoryPerformanceSeries, getOrderVolumeSeries, getPeakHoursSeries, getSalesSeries, getTopItemsSeries } from "../../services/admin/adminAnalytics.service.js";
export const AdminAnalyticsController = {
    sales: wrap(async () => ({ ...(await getSalesSeries()) })),
    orderVolume: wrap(async () => ({ ...(await getOrderVolumeSeries()) })),
    categoryPerformance: wrap(async () => ({ ...(await getCategoryPerformanceSeries()) })),
    branchPerformance: wrap(async () => ({ ...(await getBranchPerformanceSeries()) })),
    peakHours: wrap(async (req) => {
        const branchId = String(req.query.branchId ?? "").trim() || undefined;
        return { ...(await getPeakHoursSeries(branchId)) };
    }),
    topItems: wrap(async (req) => {
        const branchId = String(req.query.branchId ?? "").trim() || undefined;
        return { ...(await getTopItemsSeries(branchId)) };
    })
};
