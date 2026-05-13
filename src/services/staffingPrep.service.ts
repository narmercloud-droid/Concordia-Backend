import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service";

interface StaffingRecommendation {
  hour: number;
  expectedOrders: number;
  recommendedCouriers: number;
  recommendedKitchenStaff: number;
}

interface PrepRecommendation {
  itemId: string;
  name: string;
  expectedDailySales: number;
  recommendedPrep: number;
}

interface PrepScheduleItem {
  hour: number;
  prepStart: number;
  note: string;
}

interface OperationalPlan {
  staffing: StaffingRecommendation[];
  prep: PrepRecommendation[];
  schedule: PrepScheduleItem[];
}

export class StaffingPrepService {
  // 1. Staffing recommendations
  async staffingPlan(branchId: string): Promise<StaffingRecommendation[]> {
    const forecast = await forecastingService.forecastCourierLoad(branchId);

    return forecast.map(f => ({
      hour: f.hour,
      expectedOrders: f.expectedCouriersNeeded * 3,
      recommendedCouriers: f.expectedCouriersNeeded,
      recommendedKitchenStaff: Math.max(1, Math.ceil(f.expectedCouriersNeeded / 2))
    }));
  }

  // 2. Prep recommendations
  async prepPlan(branchId: string): Promise<PrepRecommendation[]> {
    const itemDemand = await forecastingService.forecastItemDemand(branchId);

    return itemDemand.map(i => ({
      itemId: i.itemId,
      name: i.name,
      expectedDailySales: i.expectedDailySales,
      recommendedPrep: Math.ceil(i.expectedDailySales * 0.6) // prep 60% ahead
    }));
  }

  // 3. Prep schedule (hour-by-hour)
  async prepSchedule(branchId: string): Promise<PrepScheduleItem[]> {
    const next24 = await forecastingService.forecastNext24Hours(branchId);

    return next24.map(f => ({
      hour: f.hour,
      prepStart: f.hour - 1 < 0 ? 23 : f.hour - 1,
      note: f.expectedOrders > 10 ? "High demand — prep early" : "Normal demand"
    }));
  }

  // 4. Full operational plan
  async fullPlan(branchId: string): Promise<OperationalPlan> {
    return {
      staffing: await this.staffingPlan(branchId),
      prep: await this.prepPlan(branchId),
      schedule: await this.prepSchedule(branchId)
    };
  }
}

export const staffingPrepService = new StaffingPrepService();
