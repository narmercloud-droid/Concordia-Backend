import { forecastingService } from "./forecasting.service";
export class StaffingPrepService {
    // 1. Staffing recommendations
    async staffingPlan(branchId) {
        const forecast = await forecastingService.forecastCourierLoad(branchId);
        return forecast.map(f => ({
            hour: f.hour,
            expectedOrders: f.expectedCouriersNeeded * 3,
            recommendedCouriers: f.expectedCouriersNeeded,
            recommendedKitchenStaff: Math.max(1, Math.ceil(f.expectedCouriersNeeded / 2))
        }));
    }
    // 2. Prep recommendations
    async prepPlan(branchId) {
        const itemDemand = await forecastingService.forecastItemDemand(branchId);
        return itemDemand.map(i => ({
            itemId: i.itemId,
            name: i.name,
            expectedDailySales: i.expectedDailySales,
            recommendedPrep: Math.ceil(i.expectedDailySales * 0.6) // prep 60% ahead
        }));
    }
    // 3. Prep schedule (hour-by-hour)
    async prepSchedule(branchId) {
        const next24 = await forecastingService.forecastNext24Hours(branchId);
        return next24.map(f => ({
            hour: f.hour,
            prepStart: f.hour - 1 < 0 ? 23 : f.hour - 1,
            note: f.expectedOrders > 10 ? "High demand — prep early" : "Normal demand"
        }));
    }
    // 4. Full operational plan
    async fullPlan(branchId) {
        return {
            staffing: await this.staffingPlan(branchId),
            prep: await this.prepPlan(branchId),
            schedule: await this.prepSchedule(branchId)
        };
    }
}
export const staffingPrepService = new StaffingPrepService();
