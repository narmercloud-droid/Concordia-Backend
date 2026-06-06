import express from "express";
const { Router } = express;
import { adminAuth } from "../middleware/adminAuth.js";
import { prisma } from "../prisma/client.js";
import { emailCampaignService } from "../services/emailCampaign.service.js";
const router = Router();
router.use(adminAuth);
router.get("/campaigns", async (req, res) => {
    const campaigns = await prisma.campaign.findMany({ include: { segment: true } });
    res.json(campaigns);
});
router.post("/campaigns", async (req, res) => {
    const { name, description, content, segmentId, scheduledFor, channelEmail } = req.body || {};
    if (!name || !content)
        return res.status(400).json({ error: "Campaign name and content are required." });
    const campaign = await prisma.campaign.create({
        data: {
            name,
            description,
            content,
            segmentId: segmentId ?? null,
            scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
            channelEmail: channelEmail !== false
        }
    });
    res.json(campaign);
});
router.put("/campaigns/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, content, segmentId, scheduledFor, channelEmail, status } = req.body || {};
    const campaign = await prisma.campaign.update({
        where: { id },
        data: {
            name,
            description,
            content,
            segmentId: segmentId ?? undefined,
            scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
            channelEmail: channelEmail === undefined ? undefined : channelEmail,
            status
        }
    });
    res.json(campaign);
});
router.delete("/campaigns/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.campaign.delete({ where: { id } });
    res.json({ success: true });
});
router.post("/campaigns/:id/schedule", async (req, res) => {
    const id = Number(req.params.id);
    const { scheduledFor } = req.body || {};
    if (!scheduledFor)
        return res.status(400).json({ error: "scheduledFor is required." });
    const campaign = await prisma.campaign.update({
        where: { id },
        data: {
            scheduledFor: new Date(scheduledFor),
            status: "scheduled"
        }
    });
    res.json(campaign);
});
router.post("/campaigns/:id/send-now", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await emailCampaignService.sendCampaign(id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to send campaign now." });
    }
});
router.get("/segments", async (req, res) => {
    const segments = await prisma.segment.findMany();
    res.json(segments);
});
router.post("/segments", async (req, res) => {
    const { name, filterJson } = req.body || {};
    if (!name || !filterJson)
        return res.status(400).json({ error: "Segment name and filterJson are required." });
    const segment = await prisma.segment.create({
        data: {
            name,
            filterJson: typeof filterJson === "string" ? filterJson : JSON.stringify(filterJson)
        }
    });
    res.json(segment);
});
export default router;
