import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.ts";
import { forecastingService } from "./forecasting.service.ts";
import { dynamicPricingService } from "./dynamicPricing.service.ts";
// import { menuOptimizationService } from "./menuOptimization.service.ts";
// import { staffingPrepService } from "./staffingPrep.service.ts";
import { ltvChurnService } from "./ltvChurn.service.ts";
import { knowledgeGraphService } from "./knowledgeGraph.service.ts";
import { decisionEngineService } from "./decisionEngine.service.ts";
// import { optimizationLoopService } from "./optimizationLoop.service.ts";
// import { ltmlService } from "./ltml.service.ts";
// import { orchestrationService } from "./orchestration.service.ts";

export class IntelligenceService {
  // 1. Unified intelligence summary
  async summary(branchId: string): Promise<any> {
    try {
      const summary = {
      forecasting: await forecastingService.fullForecast(branchId),
      pricing: await dynamicPricingService.optimizeBranch(branchId),
      // menu: await menuOptimizationService.optimize(branchId),
      // staffingPrep: await staffingPrepService.fullPlan(branchId),
      customerSegments: await ltvChurnService.branchSegments(branchId),
      insights: await knowledgeGraphService.generateInsights(branchId),
      decisions: await decisionEngineService.run(branchId),
      // optimization: await optimizationLoopService.run(branchId),
      // trends: await ltmlService.summary(branchId),
      // orchestration: await orchestrationService.logs(branchId)
    };

    return summary;
    } catch (err) {
      console.error("IntelligenceService summary error:", err);
      throw new Error("Intelligence summary failed");
    }
  }

  // 2. Generate intelligence report
  async generateReport(branchId: string): Promise<any> {
    try {
      const summary = await this.summary(branchId);

    const report = await prisma.intelligenceReport.create({
      data: {
        id: randomUUID(),
        branchId,
        summary: "Unified AI intelligence report generated.",
        details: summary
      }
    });

    return report;
    } catch (err) {
      console.error("IntelligenceService generateReport error:", err);
      throw new Error("Report generation failed");
    }
  }

  // 3. Log dashboard view
  async logView(branchId: string, section: string): Promise<any> {
    try {
      return prisma.dashboardViewLog.create({
        data: { id: randomUUID(), branchId, section }
      });
    } catch (err) {
      console.error("IntelligenceService logView error:", err);
      throw new Error("View logging failed");
    }
  }
}

export const intelligenceService = new IntelligenceService();




