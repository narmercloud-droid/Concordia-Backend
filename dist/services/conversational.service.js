import { prisma } from "../prisma/client.js";
import { intelligenceService } from "./intelligence.service.js";
import { nlaeService } from "./nlae.service.js";
import { orchestrationService } from "./orchestration.service.js";
import { ltmlService } from "./ltml.service.js";
export class ConversationalService {
    constructor() {
        // Personality style
        this.personality = {
            tone: "friendly, insightful, concise, helpful",
            prefix: "Here’s what I see:",
            fallback: "I’m still learning, but here’s my best insight."
        };
    }
    // 1. Generate conversational response
    async respond(branchId, message) {
        const lower = message.toLowerCase();
        let response = this.personality.fallback;
        // High-level intelligence questions
        if (lower.includes("summary") || lower.includes("overview")) {
            const summary = await intelligenceService.summary(branchId);
            response = `${this.personality.prefix} Your branch is stable. Key insights: ${summary.insights.map((i) => i.description).join(", ")}`;
        }
        // Ask AI directly
        else if (lower.includes("explain") || lower.includes("why")) {
            const logs = await orchestrationService.logs(branchId);
            if (logs.length > 0) {
                response = `${this.personality.prefix} The latest AI decision was: ${logs[0].summary}`;
            }
        }
        // Long-term intelligence
        else if (lower.includes("trend") || lower.includes("month") || lower.includes("season")) {
            const trends = await ltmlService.summary(branchId);
            response = `${this.personality.prefix} Long-term trends show: ${trends.trends.map((t) => t.summary).join(", ")}`;
        }
        // Natural language analytics fallback
        else {
            const answer = await nlaeService.ask(branchId, message);
            response = `${this.personality.prefix} ${answer}`;
        }
        // Save conversation
        await prisma.conversationLog.create({
            data: { branchId, message, response }
        });
        return response;
    }
    // 2. Get conversation history
    async history(branchId) {
        return prisma.conversationLog.findMany({
            where: { branchId },
            orderBy: { createdAt: "desc" }
        });
    }
}
export const conversationalService = new ConversationalService();
