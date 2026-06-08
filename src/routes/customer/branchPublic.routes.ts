import express from "express";
import {
  getBranchMenuForCustomer,
  getBranchItemForCustomer,
  listBranchesForCustomer,
  peekBranchMenuCache
} from "../../services/customer/branchMenu.service.ts";
import { generateTimeSlots } from "../../services/scheduling/scheduling.service.ts";
import {
  getBranchDeliveryAreas,
  quoteDelivery
} from "../../services/customer/deliveryValidation.service.ts";
import { suggestAddresses } from "../../services/geo/geocode.service.ts";
import {
  getAlsoPopularItems,
  getBranchBestsellers
} from "../../services/customer/bestsellers.service.ts";
import { validateDiscountCode } from "../../services/customer/discountCode.service.ts";
import { createGiftCardPurchase } from "../../services/customer/giftCard.service.ts";
import { getFreeDrinkOptions } from "../../services/customer/freeDrink.service.ts";
import { getBranchGoogleReviews } from "../../services/customer/googleReviews.service.ts";
import { resolveMenuLanguage } from "../../services/customer/menuTranslation.service.ts";
import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.ts";

function menuLang(req: express.Request) {
  return resolveMenuLanguage(String(req.query.lang ?? ""));
}

const router = express.Router();

function publicCache(maxAgeSec: number) {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${maxAgeSec}, stale-while-revalidate=120`
    );
    next();
  };
}

router.get("/branches", publicCache(180), wrap(async () => {
  return await listBranchesForCustomer();
}));

router.get("/branches/:branchId/menu", publicCache(300), wrap(async (req) => {
  const branchId = req.params.branchId;
  const lang = menuLang(req);
  const cached = await peekBranchMenuCache(branchId, lang);
  if (cached) {
    return { categories: cached };
  }

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, BranchConfig: { select: { configJson: true } } }
  });

  if (!branch) {
    throw { code: "NOT_FOUND", message: "Branch not found" };
  }

  const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  if (config.status === "coming_soon") {
    throw { code: "FORBIDDEN", message: "This branch is not available yet" };
  }

  const categories = await getBranchMenuForCustomer(branchId, lang);
  return { categories };
}));

router.get("/branches/:branchId/time-slots", wrap(async (req) => {
  const slots = await generateTimeSlots(req.params.branchId);
  return { slots };
}));

router.get("/branches/:branchId/delivery-areas", wrap(async (req) => {
  const areas = await getBranchDeliveryAreas(req.params.branchId);
  return { areas };
}));

router.get("/branches/:branchId/address-suggest", wrap(async (req) => {
  const q = String(req.query.q ?? "").trim();
  const postalCode = String(req.query.postalCode ?? "").trim() || undefined;

  if (!q) {
    return { suggestions: [] };
  }

  const suggestions = await suggestAddresses(q, { postalCode });
  return { suggestions };
}));

router.get("/branches/:branchId/free-drink-options", publicCache(300), wrap(async (req) => {
  const options = await getFreeDrinkOptions(req.params.branchId);
  return { options };
}));

router.post("/promo/validate", wrap(async (req) => {
  const code = String(req.body?.code ?? "").trim();
  const orderTotal = Number(req.body?.orderTotal ?? 0);
  const branchId = String(req.body?.branchId ?? "").trim();

  if (!code) {
    throw { code: "INVALID_INPUT", message: "Gutscheincode fehlt" };
  }
  if (!branchId) {
    throw { code: "INVALID_INPUT", message: "branchId fehlt" };
  }

  try {
    return await validateDiscountCode(branchId, code, orderTotal);
  } catch (err: any) {
    throw { code: "INVALID_INPUT", message: err?.message ?? "Gutscheincode ungültig" };
  }
}));

router.post("/branches/:branchId/gift-cards", wrap(async (req) => {
  const amount = Number(req.body?.amount ?? 0);
  const purchaserName = String(req.body?.purchaserName ?? "").trim();
  const paymentMethod = String(req.body?.paymentMethod ?? "paypal").trim();

  if (!purchaserName) {
    throw { code: "INVALID_INPUT", message: "Name ist erforderlich" };
  }

  try {
    return await createGiftCardPurchase({
      branchId: req.params.branchId,
      amount,
      purchaserName,
      purchaserEmail: req.body?.purchaserEmail,
      purchaserPhone: req.body?.purchaserPhone,
      recipientName: req.body?.recipientName,
      message: req.body?.message,
      paymentMethod
    });
  } catch (err: any) {
    throw { code: "INVALID_INPUT", message: err?.message ?? "Gutschein konnte nicht erstellt werden" };
  }
}));

router.get("/gift-cards/:purchaseId", wrap(async (req) => {
  const card = await prisma.branchGiftCard.findUnique({
    where: { id: req.params.purchaseId }
  });
  if (!card) {
    throw { code: "NOT_FOUND", message: "Gutscheinkauf nicht gefunden" };
  }
  return {
    purchaseId: card.id,
    branchId: card.branchId,
    code: card.paymentStatus === "paid" ? card.code : null,
    amount: Number(card.initialAmount),
    balance: Number(card.balance),
    paymentStatus: card.paymentStatus,
    paymentMethod: card.paymentMethod
  };
}));

router.post("/branches/:branchId/delivery-quote", wrap(async (req) => {
  const { address, orderTotal, postalCode } = req.body ?? {};
  const addressText = String(address ?? "").trim();
  const postcodeText = String(postalCode ?? "").trim();

  if (!addressText && !postcodeText) {
    throw { code: "INVALID_INPUT", message: "address or postalCode is required" };
  }

  const total = Number(orderTotal ?? 0);
  return quoteDelivery(req.params.branchId, addressText, total, {
    postalCode: postcodeText || undefined
  });
}));

router.get("/branches/:branchId/google-reviews", publicCache(3600), wrap(async (req) => {
  return await getBranchGoogleReviews(req.params.branchId);
}));

router.get("/branches/:branchId/bestsellers", publicCache(300), wrap(async (req) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 6) || 6, 1), 12);
  return getBranchBestsellers(req.params.branchId, limit, menuLang(req));
}));

router.get("/branches/:branchId/items/:itemId/also-popular", wrap(async (req) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId)) {
    throw { code: "INVALID_INPUT", message: "Invalid item id" };
  }
  return getAlsoPopularItems(req.params.branchId, itemId, 4, menuLang(req));
}));

router.get("/branches/:branchId/items/:itemId", wrap(async (req) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId)) {
    throw { code: "INVALID_INPUT", message: "Invalid item id" };
  }

  const item = await getBranchItemForCustomer(req.params.branchId, itemId, menuLang(req));
  if (!item) {
    throw { code: "NOT_FOUND", message: "Item not found" };
  }

  return item;
}));

export default router;
