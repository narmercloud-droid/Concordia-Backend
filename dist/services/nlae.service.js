import { prisma } from "../prisma/client.js";
import { forecastingService } from "./forecasting.service.js";
import { ltvChurnService } from "./ltvChurn.service.js";
import { menuOptimizationService } from "./menuOptimization.service.js";
import { knowledgeGraphService } from "./knowledgeGraph.service.js";
export class NLAEService {
    classify(question) {
        const q = question.toLowerCase();
        if (q.includes("forecast") || q.includes("busy") || q.includes("predict"))
            return "forecasting";
        if (q.includes("stock") || q.includes("inventory"))
            return "inventory";
        if (q.includes("customer") || q.includes("churn") || q.includes("ltv"))
            return "customer";
        if (q.includes("price") || q.includes("pricing"))
            return "pricing";
        if (q.includes("menu") || q.includes("item"))
            return "menu";
        if (q.includes("insight") || q.includes("pattern") || q.includes("anomaly"))
            return "insights";
        if (q.includes("decision") || q.includes("why did"))
            return "decisions";
        return "general";
    }
    async handleForecasting(branchId) {
        const forecast = await forecastingService.fullForecast(branchId);
        const entries = forecast.forecast || [];
        const topHour = entries.sort((a, b) => (b.expectedOrders || 0) - (a.expectedOrders || 0))[0];
        return `Tomorrow's busiest hour is likely ${topHour?.hour ?? "unknown"}:00.`;
    }
    async handleInventory(branchId) {
        const stock = await forecastingService.forecastStock(branchId);
        const levels = stock.stockLevels || [];
        const low = levels.filter((s) => s.expectedDaysUntilOut !== "N/A" && Number(s.expectedDaysUntilOut) < 2);
        if (low.length === 0)
            return "No items are at risk of running out.";
        return `Items at risk: ${low.map(l => l.name).join(", ")}.`;
    }
    async handleCustomer(branchId) {
        const { segments } = await ltvChurnService.branchSegments(branchId);
        const atRisk = segments.filter(s => s.segment === "at-risk");
        return `${atRisk.length} customers are at high churn risk.`;
    }
    async handleMenu(branchId) {
        const opt = await menuOptimizationService.optimize(branchId);
        const underperforming = opt.optimizations || [];
        return `Underperforming items: ${underperforming.map((i) => i.name).join(", ")}`;
    }
    async handleInsights(branchId) {
        const insightsResponse = await knowledgeGraphService.generateInsights(branchId);
        const insights = insightsResponse.insights || [];
        if (insights.length === 0)
            return "No new insights detected.";
        return insights.map((i) => i.description).join(" | ");
    }
    async handleDecisions(branchId) {
        const logs = await prisma.decisionLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" },
            take: 5
        });
        if (logs.length === 0)
            return "No recent AI decisions.";
        return logs.map(l => `${l.actionType}: ${l.description}`).join(" | ");
    }
    async ask(branchId, question) {
        const type = this.classify(question);
        let answer = "I’m not sure, but I will learn to answer this soon.";
        if (type === "forecasting")
            answer = await this.handleForecasting(branchId);
        if (type === "inventory")
            answer = await this.handleInventory(branchId);
        if (type === "customer")
            answer = await this.handleCustomer(branchId);
        if (type === "menu")
            answer = await this.handleMenu(branchId);
        if (type === "insights")
            answer = await this.handleInsights(branchId);
        if (type === "decisions")
            answer = await this.handleDecisions(branchId);
        await prisma.analyticsQueryLog.create({
            data: { branchId, question, answer }
        });
        return answer;
    }
}
export const nlaeService = new NLAEService();
