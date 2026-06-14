import { prisma } from "../../prisma/client.ts";
import logger from "../../logger.ts";
import {
  getBirthdayCandidates,
  getWinBackCandidates
} from "./branchCustomer.service.ts";
import { sendBranchMessage } from "./branchMessaging.service.ts";
import { env } from "../../config/env.ts";

const WINBACK_CODE = process.env.WINBACK_PROMO_CODE || "WELCOME10";
const BIRTHDAY_CODE = process.env.BIRTHDAY_PROMO_CODE || "BIRTHDAY";

function orderUrl(branchId: string) {
  const base = env.FRONTEND_URL ?? "https://www.concordiapizza.de";
  return `${base}/customer/branch/${branchId}`;
}

export async function runWinBackForBranch(branchId: string) {
  const candidates = await getWinBackCandidates(branchId);
  let sent = 0;

  for (const customer of candidates) {
    const name = customer.name?.split(" ")[0] ?? "Freund";
    const text = [
      `Hallo ${name}! Wir vermissen Sie bei Concordia.`,
      `Als Dankeschön: Code ${WINBACK_CODE} für 10% Rabatt auf Ihre nächste Bestellung.`,
      `Jetzt bestellen: ${orderUrl(branchId)}`
    ].join("\n");

    const result = await sendBranchMessage(
      customer,
      "Wir vermissen Sie bei Concordia",
      text
    );

    if (result.sent) {
      await prisma.branchCustomer.update({
        where: { id: customer.id },
        data: { winBackOfferSentAt: new Date() }
      });
      sent++;
    }
  }

  logger.info({ branchId, candidates: candidates.length, sent }, "Win-back run");
  return { candidates: candidates.length, sent };
}

export async function runBirthdayForBranch(branchId: string) {
  const candidates = await getBirthdayCandidates(branchId);
  let sent = 0;

  for (const customer of candidates) {
    const name = customer.name?.split(" ")[0] ?? "Freund";
    const text = [
      `Alles Gute zum Geburtstag, ${name}! 🎂`,
      `Concordia schenkt Ihnen einen Gratis-Nachtisch — Code ${BIRTHDAY_CODE} bei Ihrer Bestellung.`,
      `Bestellen: ${orderUrl(branchId)}`
    ].join("\n");

    const result = await sendBranchMessage(
      customer,
      "Happy Birthday von Concordia",
      text
    );

    if (result.sent) {
      await prisma.branchCustomer.update({
        where: { id: customer.id },
        data: { birthdayOfferSentAt: new Date() }
      });
      sent++;
    }
  }

  logger.info({ branchId, candidates: candidates.length, sent }, "Birthday run");
  return { candidates: candidates.length, sent };
}

async function listLiveBranchIds() {
  const branches = await prisma.branch.findMany({
    select: { id: true, BranchConfig: { select: { configJson: true } } }
  });

  return branches
    .filter((b) => {
      const config = (b.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
      const status = String(config.status ?? "live");
      return status === "live";
    })
    .map((b) => b.id);
}

export async function runAutomationForAllBranches() {
  const branchIds = await listLiveBranchIds();

  const results = [];
  for (const branchId of branchIds) {
    const winBack = await runWinBackForBranch(branchId);
    const birthday = await runBirthdayForBranch(branchId);
    results.push({ branchId, winBack, birthday });
  }
  return results;
}
