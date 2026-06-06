import { prisma } from "../prisma/client.ts";
import { segmentService } from "./segment.service.ts";
import logger from "../logger.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.CAMPAIGN_FROM_EMAIL || "marketing@concordia.app";

export class EmailCampaignService {
  async sendCampaign(campaignId: number): Promise<{ sent: number; total: number }> {
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

  private async sendCampaignEmail(email: string, campaign: any) {
    if (!RESEND_API_KEY) {
      logger.warn({ email }, `Skipping campaign email: RESEND_API_KEY not configured`);
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

