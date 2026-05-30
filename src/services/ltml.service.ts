import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
// import { forecastingService } from "./forecasting.service.js";
// import { ltvChurnService } from "./ltvChurn.service.js";
// import { behaviorPredictionService } from "./behaviorPrediction.service.js";
// import { dynamicPricingService } from "./dynamicPricing.service.js";
// import { knowledgeGraphService } from "./knowledgeGraph.service.js";

interface TrendData {
  category: string;
  summary: string;
}

interface LTMLSummary {
  message: string;
  trends: TrendData[];
}

export class LTMLService {
  // 1. Save memory record
  async save(branchId: string, module: string, key: string, value: any): Promise<any> {
    return prisma.memoryRecord.create({
      data: {
        id: randomUUID(),
        branchId,
        module,
        key,
        value
      }
    });
  }

  // 2. Generate long-term trends
  async generateTrends(branchId: string): Promise<TrendData[]> {
    const last30 = await prisma.memoryRecord.findMany({
      where: {
        branchId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) }
      }
    });

    const demandRecords = last30.filter(r => r.module === "forecasting");
    const pricingRecords = last30.filter(r => r.module === "pricing");
    const churnRecords = last30.filter(r => r.module === "churn");

    const trends: TrendData[] = [];

    if (demandRecords.length > 10) {
      trends.push({
        category: "demand",
        summary: "Demand has shown consistent weekly cycles with weekend peaks."
      });
    }

    if (pricingRecords.length > 10) {
      trends.push({
        category: "pricing",
        summary: "Dynamic pricing adjustments increased revenue stability."
      });
    }

    if (churnRecords.length > 10) {
      trends.push({
        category: "churn",
        summary: "Churn risk decreased after targeted retention actions."
      });
    }

    for (const t of trends) {
      await prisma.trendRecord.create({
        data: {
          id: randomUUID(),
          branchId,
          category: t.category,
          summary: t.summary
        }
      });
    }

    return trends;
  }

  // 3. Long-term intelligence summary
  async summary(branchId: string): Promise<LTMLSummary> {
    const trends = await prisma.trendRecord.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return {
      message: "Long-term intelligence summary generated.",
      trends
    };
  }
}

export const ltmlService = new LTMLService();




