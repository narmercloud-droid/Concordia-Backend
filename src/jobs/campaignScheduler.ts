import { prisma } from "../prisma/client.js";
import { emailCampaignService } from "../services/emailCampaign.service.js";

export async function runScheduledCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "scheduled",
      scheduledFor: {
        lte: new Date()
      }
    }
  });

  for (const campaign of campaigns) {
    try {
      await emailCampaignService.sendCampaign(campaign.id);
      console.log(`[CampaignScheduler] Sent campaign ${campaign.id} (${campaign.name})`);
    } catch (error: unknown) {
      console.error(`[CampaignScheduler] Failed to send campaign ${campaign.id}:`, error);
    }
  }
}

export function startCampaignScheduler() {
  runScheduledCampaigns().catch(error => {
    console.error("[CampaignScheduler] Initial polling failed:", error);
  });

  setInterval(() => {
    runScheduledCampaigns().catch(error => {
      console.error("[CampaignScheduler] Scheduled poll failed:", error);
    });
  }, 60_000);
}

