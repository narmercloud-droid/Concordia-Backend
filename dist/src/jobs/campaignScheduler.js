import { prisma } from "../prisma/client.js";
import { emailCampaignService } from "../services/emailCampaign.service.js";
import logger from "../logger.js";
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
            logger.info({ campaignId: campaign.id, name: campaign.name }, "Sent campaign");
        }
        catch (error) {
            logger.error({ campaignId: campaign.id, error }, "Failed to send campaign");
        }
    }
}
export function startCampaignScheduler() {
    runScheduledCampaigns().catch(error => {
        logger.error({ error }, "[CampaignScheduler] Initial polling failed");
    });
    setInterval(() => {
        runScheduledCampaigns().catch(error => {
            logger.error({ error }, "[CampaignScheduler] Scheduled poll failed");
        });
    }, 60000);
}
