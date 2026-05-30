import { prisma } from "../prisma/client.js";
import { randomUUID } from "crypto";
import { intelligenceService } from "./intelligence.service.js";
import { nlaeService } from "./nlae.service.js";
import { orchestrationService } from "./orchestration.service.js";
import { ltmlService } from "./ltml.service.js";

export class ConversationalService {
  // Personality style
  personality = {
    tone: "friendly, insightful, concise, helpful",
    prefix: "Hereâ€™s what I see:",
    fallback: "Iâ€™m still learning, but hereâ€™s my best insight."
  };

  // 1. Generate conversational response
  async respond(branchId: string, message: string): Promise<string> {
    const lower = message.toLowerCase();
    let response = this.personality.fallback;

    // High-level intelligence questions
    if (lower.includes("summary") || lower.includes("overview")) {
      const summary = await intelligenceService.summary(branchId);
      response = `${this.personality.prefix} Your branch is stable. Key insights: ${summary.insights.map((i: any) => i.description).join(", ")}`;
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
      response = `${this.personality.prefix} Long-term trends show: ${trends.trends.map((t: any) => t.summary).join(", ")}`;
    }

    // Natural language analytics fallback
    else {
      const answer = await nlaeService.ask(branchId, message);
      response = `${this.personality.prefix} ${answer}`;
    }

    // Save conversation
    await prisma.conversationLog.create({
      data: { id: randomUUID(), branchId, message, response }
    });

    return response;
  }

  // 2. Get conversation history
  async history(branchId: string) {
    return prisma.conversationLog.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" }
    });
  }
}

export const conversationalService = new ConversationalService();




