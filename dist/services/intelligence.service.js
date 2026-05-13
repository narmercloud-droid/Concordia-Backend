import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service.js";
import { dynamicPricingService } from "./dynamicPricing.service.js";
// import { menuOptimizationService } from "./menuOptimization.service";
// import { staffingPrepService } from "./staffingPrep.service";
import { ltvChurnService } from "./ltvChurn.service.js";
import { knowledgeGraphService } from "./knowledgeGraph.service.js";
import { decisionEngineService } from "./decisionEngine.service.js";
// import { optimizationLoopService } from "./optimizationLoop.service";
// import { ltmlService } from "./ltml.service";
// import { orchestrationService } from "./orchestration.service";
export class IntelligenceService {
    // 1. Unified intelligence summary
    async summary(branchId) {
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
        }
        catch (err) {
            console.error("IntelligenceService summary error:", err);
            throw new Error("Intelligence summary failed");
        }
    }
    // 2. Generate intelligence report
    async generateReport(branchId) {
        try {
            const summary = await this.summary(branchId);
            const report = await prisma.intelligenceReport.create({
                data: {
                    branchId,
                    summary: "Unified AI intelligence report generated.",
                    details: summary
                }
            });
            return report;
        }
        catch (err) {
            console.error("IntelligenceService generateReport error:", err);
            throw new Error("Report generation failed");
        }
    }
    // 3. Log dashboard view
    async logView(branchId, section) {
        try {
            return prisma.dashboardViewLog.create({
                data: { branchId, section }
            });
        }
        catch (err) {
            console.error("IntelligenceService logView error:", err);
            throw new Error("View logging failed");
        }
    }
}
export const intelligenceService = new IntelligenceService();
