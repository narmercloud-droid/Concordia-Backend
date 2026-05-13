import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service";
import { dynamicPricingService } from "./dynamicPricing.service";
import { menuOptimizationService } from "./menuOptimization.service";
import { staffingPrepService } from "./staffingPrep.service";
import { ltvChurnService } from "./ltvChurn.service";
import { behaviorPredictionService } from "./behaviorPrediction.service";
import { knowledgeGraphService } from "./knowledgeGraph.service";
import { decisionEngineService } from "./decisionEngine.service";
import { optimizationLoopService } from "./optimizationLoop.service";

export class OrchestrationService {
  // 1. Run all modules in priority order
  async runAll(branchId: string): Promise<any> {
    try {
      const results: Record<string, any> = {};

    // Priority 1: Forecasting
    results.forecasting = await forecastingService.fullForecast(branchId);

    // Priority 2: Menu optimization
    results.menu = await menuOptimizationService.optimize(branchId);

    // Priority 3: Dynamic pricing
    results.pricing = await dynamicPricingService.optimizeBranch(branchId);

    // Priority 4: Staffing & prep
    results.staffingPrep = await staffingPrepService.fullPlan(branchId);

    // Priority 5: Customer intelligence
    results.customerSegments = await ltvChurnService.branchSegments(branchId);

    // Priority 6: Behavior prediction (sample)
    const customers = await prisma.customer.findMany({ take: 5 });
    results.behavior = [];
    for (const c of customers) {
      results.behavior.push(await behaviorPredictionService.fullProfile(c.id));
    }

    // Priority 7: Knowledge graph insights
    results.insights = await knowledgeGraphService.generateInsights(branchId);

    // Priority 8: Decision engine
    results.decisions = await decisionEngineService.run(branchId);

    // Priority 9: Optimization loop
    results.optimization = await optimizationLoopService.run(branchId);

    // Merge summary
    const summary = `AI cycle completed: ${Object.keys(results).length} modules executed.`;

    await prisma.orchestrationLog.create({
      data: { branchId, cycleType: "manual", summary }
    });

    return results;
    } catch (err) {
      console.error("OrchestrationService runAll error:", err);
      throw new Error("Orchestration runAll failed");
    }
  }

  // 2. Event-triggered orchestration
  async eventTrigger(branchId: string, event: string): Promise<any> {
    try {
      let summary = "";

    if (event === "low_stock") {
      const insights = await knowledgeGraphService.generateInsights(branchId);
      summary = `Triggered by low stock: ${insights.length} insights generated.`;
    }

    if (event === "high_demand") {
      const pricing = await dynamicPricingService.optimizeBranch(branchId);
      summary = `Triggered by high demand: ${pricing.length} price updates.`;
    }

    await prisma.orchestrationLog.create({
      data: { branchId, cycleType: "event-triggered", summary }
    });

    return { event, summary };
    } catch (err) {
      console.error("OrchestrationService eventTrigger error:", err);
      throw new Error("Event trigger failed");
    }
  }

  // 3. Get logs
  async logs(branchId: string): Promise<any> {
    try {
      return prisma.orchestrationLog.findMany({
        where: { branchId },
        orderBy: { createdAt: "desc" }
      });
    } catch (err) {
      console.error("OrchestrationService logs error:", err);
      throw new Error("Logs retrieval failed");
    }
  }
}

export const orchestrationService = new OrchestrationService();
