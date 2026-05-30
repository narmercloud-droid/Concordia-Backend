import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service.js";
import { dynamicPricingService } from "./dynamicPricing.service.js";
// import { menuOptimizationService } from "./menuOptimization.service.js";
// import { staffingPrepService } from "./staffingPrep.service.js";
import { ltvChurnService } from "./ltvChurn.service.js";
import { behaviorPredictionService } from "./behaviorPrediction.service.js";
import { knowledgeGraphService } from "./knowledgeGraph.service.js";
import { decisionEngineService } from "./decisionEngine.service.js";
// import { optimizationLoopService } from "./optimizationLoop.service.js";
// import { ltmlService } from "./ltml.service.js";
// import { orchestrationService } from "./orchestration.service.js";

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




