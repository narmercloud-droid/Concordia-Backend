import { prisma } from "../prisma/client.js";
import { segmentService } from "./segment.service.js";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.CAMPAIGN_FROM_EMAIL || "marketing@concordia.app";
export class EmailCampaignService {
    async sendCampaign(campaignId) {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: { segment: true }
        });
        if (!campaign) {
            throw new Error("Campaign not found");
        }
        const recipients = campaign.segmentId
            ? await segmentService.getCustomersForSegment(campaign.segmentId)
            : [];
        const emailRecipients = recipients.filter(customer => customer.marketingEmail === true);
        for (const customer of emailRecipients) {
            await this.sendCampaignEmail(customer.email, campaign);
        }
        await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: "sent" }
        });
        return {
            sent: emailRecipients.length,
            total: recipients.length
        };
    }
    async sendCampaignEmail(email, campaign) {
        if (!RESEND_API_KEY) {
            console.log(`[Campaign] Skipping email for ${email} because RESEND_API_KEY is not configured.`);
            return;
        }
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h1>${campaign.name}</h1>
        <p>${campaign.description || ""}</p>
        <div>${campaign.content}</div>
      </div>
    `;
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: FROM_ADDRESS,
                to: email,
                subject: campaign.name,
                html
            })
        });
    }
}
export const emailCampaignService = new EmailCampaignService();
