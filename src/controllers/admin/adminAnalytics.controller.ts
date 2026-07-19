import type { Request } from "express";
import { wrap } from "../../contracts/api.ts";
import {
  getBranchPerformanceSeries,
  getCategoryPerformanceSeries,
  getOrderLocationAnalytics,
  getOrderVolumeSeries,
  getPeakHoursSeries,
  getSalesSeries,
  getTopItemsSeries
} from "../../services/admin/adminAnalytics.service.ts";
import { resolveManagerBranchId } from "../../middleware/managerAccess.ts";

function branchIdFromRequest(req: Request) {
  return resolveManagerBranchId(req) ?? undefined;
}

function daysFromRequest(req: Request, fallback = 90) {
  const raw = Number(req.query.days);
  if (!Number.isFinite(raw)) return fallback;
  return Math.min(365, Math.max(7, Math.round(raw)));
}

export const AdminAnalyticsController = {
  sales: wrap(async (req: Request) => getSalesSeries(7, branchIdFromRequest(req))),

  orderVolume: wrap(async (req: Request) => getOrderVolumeSeries(7, branchIdFromRequest(req))),

  categoryPerformance: wrap(async (req: Request) =>
    getCategoryPerformanceSeries(branchIdFromRequest(req))
  ),

  branchPerformance: wrap(async (req: Request) =>
    getBranchPerformanceSeries(branchIdFromRequest(req))
  ),

  peakHours: wrap(async (req: Request) => getPeakHoursSeries(branchIdFromRequest(req))),

  topItems: wrap(async (req: Request) => getTopItemsSeries(branchIdFromRequest(req))),

  orderLocations: wrap(async (req: Request) =>
    getOrderLocationAnalytics(daysFromRequest(req), branchIdFromRequest(req))
  )
};
