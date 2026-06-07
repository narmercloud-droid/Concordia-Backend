import { randomUUID } from "crypto";
import { prisma } from "../../prisma/client.ts";

type LeadInput = {
  phone: string;
  name?: string;
  email?: string | null;
  branchId?: string;
  marketingEmail: boolean;
  marketingSMS: boolean;
  marketingWhatsApp: boolean;
};

export async function upsertMarketingLead(input: LeadInput) {
  const hasChannel =
    input.marketingEmail || input.marketingSMS || input.marketingWhatsApp;
  if (!hasChannel) return null;

  const phone = input.phone.trim();
  if (!phone) return null;

  const now = new Date();
  const existing = await prisma.marketingLead.findUnique({ where: { phone } });

  if (existing) {
    return prisma.marketingLead.update({
      where: { phone },
      data: {
        name: input.name?.trim() || existing.name,
        email: input.email?.trim() || existing.email,
        branchId: input.branchId ?? existing.branchId,
        marketingEmail: input.marketingEmail || existing.marketingEmail,
        marketingSMS: input.marketingSMS || existing.marketingSMS,
        marketingWhatsApp: input.marketingWhatsApp || existing.marketingWhatsApp,
        consentAt: existing.consentAt ?? now,
        lastOrderAt: now
      }
    });
  }

  return prisma.marketingLead.create({
    data: {
      id: randomUUID(),
      phone,
      name: input.name?.trim() || null,
      email: input.email?.trim() || null,
      branchId: input.branchId ?? null,
      marketingEmail: input.marketingEmail,
      marketingSMS: input.marketingSMS,
      marketingWhatsApp: input.marketingWhatsApp,
      consentAt: now,
      lastOrderAt: now
    }
  });
}
