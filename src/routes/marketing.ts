import express from "express";
const { Router } = express;
import { customerAuth } from "../middleware/customerAuth.ts";
import { prisma } from "../prisma/client.ts";

const router = Router();

router.put("/marketing-preferences", customerAuth, async (req, res) => {
  const {
    marketingConsent,
    marketingEmail,
    marketingSMS,
    marketingWhatsApp
  } = req.body || {};

  if (typeof marketingConsent !== "boolean" && typeof marketingEmail !== "boolean" && typeof marketingSMS !== "boolean" && typeof marketingWhatsApp !== "boolean") {
    return res.status(400).json({ error: "At least one marketing preference must be provided." });
  }

  const customerId = (req as any).user?.id;
  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const existing = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      marketingConsent: true
    }
  });

  const updates: Record<string, any> = {};
  if (typeof marketingConsent === "boolean") {
    updates.marketingConsent = marketingConsent;
    if (marketingConsent === true && existing?.marketingConsent !== true) {
      updates.marketingConsentAt = new Date();
    }
    if (marketingConsent === false) {
      updates.marketingConsentAt = null;
    }
  }
  if (typeof marketingEmail === "boolean") {
    updates.marketingEmail = marketingEmail;
  }
  if (typeof marketingSMS === "boolean") {
    updates.marketingSMS = marketingSMS;
  }
  if (typeof marketingWhatsApp === "boolean") {
    updates.marketingWhatsApp = marketingWhatsApp;
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: updates,
    select: {
      marketingConsent: true,
      marketingEmail: true,
      marketingSMS: true,
      marketingWhatsApp: true,
      marketingConsentAt: true
    }
  });

  return res.json({ marketingPreferences: updatedCustomer });
});

router.get("/loyalty", customerAuth, async (req, res) => {
  const customerId = (req as any).user?.id;
  if (!customerId) return res.status(401).json({ error: "Unauthorized" });

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { loyaltyPoints: true }
  });

  res.json({ loyaltyPoints: customer?.loyaltyPoints ?? 0 });
});

export default router;

