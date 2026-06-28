import express from "express";
import {
  getBranchMenuForCustomer,
  getBranchItemForCustomer,
  listBranchesForCustomer,
  getPlatformPromoForCustomer,
  peekBranchMenuCache,
  isCustomerBranchVisible
} from "../../services/customer/branchMenu.service.ts";
import { generateTimeSlots } from "../../services/scheduling/scheduling.service.ts";
import {
  getDeliverySettings,
  isDeliverableAtCoords,
  quoteDelivery
} from "../../services/customer/deliveryValidation.service.ts";
import { reverseGeocode, suggestAddresses } from "../../services/geo/geocode.service.ts";
import {
  getAlsoPopularItems,
  getBranchBestsellers,
  getCartSuggestions
} from "../../services/customer/bestsellers.service.ts";
import { validateDiscountCode } from "../../services/customer/discountCode.service.ts";
import { listActiveCampaignsForBranch } from "../../services/customer/couponCampaign.service.ts";
import { optionalCustomerAuth } from "../../middleware/customerAuth.ts";
import { createGiftCardPurchase } from "../../services/customer/giftCard.service.ts";
import { getFreeDrinkOptions } from "../../services/customer/freeDrink.service.ts";
import { getBranchGoogleReviews } from "../../services/customer/googleReviews.service.ts";
import { submitContactForm } from "../../services/customer/contact.service.ts";
import contactRateLimit from "../../middleware/contactRateLimit.ts";
import { resolveMenuLanguage } from "../../services/customer/menuTranslation.service.ts";
import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.ts";

function menuLang(req: express.Request) {
  return resolveMenuLanguage(String(req.query.lang ?? ""));
}

const router = express.Router();

function publicCache(maxAgeSec: number, staleSec = 300) {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${maxAgeSec}, stale-while-revalidate=${staleSec}`
    );
    next();
  };
}

/** Customer config/menu must reflect admin changes immediately — server-side cache only. */
function noBrowserCache(_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader("Cache-Control", "private, no-cache, must-revalidate");
  next();
}

router.get("/branches", noBrowserCache, wrap(async () => {
  return await listBranchesForCustomer();
}));

router.use("/branches/:branchId", (req, _res, next) => {
  if (!isCustomerBranchVisible(req.params.branchId)) {
    next({ code: "NOT_FOUND", message: "Branch not found" });
    return;
  }
  next();
});

router.get("/platform-promo", noBrowserCache, wrap(async () => {
  return await getPlatformPromoForCustomer();
}));

router.get("/branches/:branchId/menu", noBrowserCache, wrap(async (req) => {
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

  const categories = await getBranchMenuForCustomer(branchId, lang);
  return { categories };
}));

router.get("/branches/:branchId/time-slots", wrap(async (req) => {
  const slots = await generateTimeSlots(req.params.branchId);
  return { slots };
}));

router.get("/branches/:branchId/delivery-areas", wrap(async (req) => {
  const settings = await getDeliverySettings(req.params.branchId);
  return {
    areas: settings.deliveryAreas,
    deliveryMode: settings.deliveryMode
  };
}));

router.get("/branches/:branchId/reverse-geocode", wrap(async (req) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw { code: "INVALID_INPUT", message: "lat and lng are required" };
  }

  const result = await reverseGeocode(lat, lng);
  if (!result) {
    throw { code: "NOT_FOUND", message: "Could not resolve address for this location" };
  }

  const deliverable = await isDeliverableAtCoords(
    req.params.branchId,
    lat,
    lng,
    result.postalCode
  );
  if (!deliverable) {
    throw {
      code: "NOT_FOUND",
      message: "This location is outside the delivery area for this branch"
    };
  }

  return result;
}));

router.get("/branches/:branchId/address-suggest", wrap(async (req) => {
  const q = String(req.query.q ?? "").trim();
  const postalCode = String(req.query.postalCode ?? "").trim() || undefined;
  const city = String(req.query.city ?? "").trim() || undefined;

  if (!q || q.length < 2) {
    return { suggestions: [] };
  }

  const branch = await prisma.branch.findUnique({
    where: { id: req.params.branchId },
    select: { BranchConfig: { select: { configJson: true } } }
  });
  const config = (branch?.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  const nearCity = city || String(config.city ?? "");
  const queryLat = Number(req.query.lat ?? 0);
  const queryLng = Number(req.query.lng ?? 0);
  const configLat = Number(config.lat ?? 0);
  const configLng = Number(config.lng ?? 0);

  const settings = await getDeliverySettings(req.params.branchId);
  const allowedPostcodes = new Set(
    settings.deliveryAreas.map((area) => area.postalCode).filter(Boolean)
  );

  const suggestions = await suggestAddresses(q, {
    postalCode,
    city: nearCity,
    nearCity,
    lat:
      Number.isFinite(queryLat) && queryLat !== 0
        ? queryLat
        : Number.isFinite(configLat) && configLat !== 0
          ? configLat
          : undefined,
    lng:
      Number.isFinite(queryLng) && queryLng !== 0
        ? queryLng
        : Number.isFinite(configLng) && configLng !== 0
          ? configLng
          : undefined
  });

  const filtered =
    allowedPostcodes.size > 0 &&
    (settings.deliveryMode === "postcodes" || settings.deliveryMode === "both")
      ? suggestions.filter((s) => !s.postalCode || allowedPostcodes.has(s.postalCode))
      : suggestions;

  return { suggestions: filtered };
}));

router.get("/branches/:branchId/free-drink-options", publicCache(300), wrap(async (req) => {
  const options = await getFreeDrinkOptions(req.params.branchId);
  return { options };
}));

router.get(
  "/branches/:branchId/coupon-campaigns",
  optionalCustomerAuth,
  publicCache(60),
  wrap(async (req) => {
    const customerId = (req as express.Request & { customer?: { id: string } }).customer?.id ?? null;
    const campaigns = await listActiveCampaignsForBranch(req.params.branchId, customerId);
    return { campaigns };
  })
);

router.post("/promo/validate", optionalCustomerAuth, wrap(async (req) => {
  const code = String(req.body?.code ?? "").trim();
  const orderTotal = Number(req.body?.orderTotal ?? 0);
  const branchId = String(req.body?.branchId ?? "").trim();
  const customerId =
    (req as express.Request & { customer?: { id: string } }).customer?.id ?? null;

  if (!code) {
    throw { code: "INVALID_INPUT", message: "Gutscheincode fehlt" };
  }
  if (!branchId) {
    throw { code: "INVALID_INPUT", message: "branchId fehlt" };
  }

  try {
    return await validateDiscountCode(branchId, code, orderTotal, { customerId });
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

router.get("/branches/:branchId/google-reviews", publicCache(3600, 7200), wrap(async (req) => {
  return await getBranchGoogleReviews(req.params.branchId);
}));

router.get("/branches/:branchId/bestsellers", noBrowserCache, wrap(async (req) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 6) || 6, 1), 12);
  return getBranchBestsellers(req.params.branchId, limit, menuLang(req));
}));

router.get("/branches/:branchId/cart-suggestions", wrap(async (req) => {
  const excludeRaw = String(req.query.excludeIds ?? req.query.exclude ?? "").trim();
  const excludeItemIds = excludeRaw
    ? excludeRaw
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isFinite(id) && id > 0)
    : [];
  return getCartSuggestions(req.params.branchId, excludeItemIds, menuLang(req));
}));

router.get("/branches/:branchId/items/:itemId/also-popular", wrap(async (req) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId)) {
    throw { code: "INVALID_INPUT", message: "Invalid item id" };
  }
  return getAlsoPopularItems(req.params.branchId, itemId, 4, menuLang(req));
}));

router.post("/contact", contactRateLimit, wrap(async (req) => {
  const body = req.body ?? {};
  if (String(body._hp ?? body.company ?? "").trim()) {
    return { sent: true };
  }
  return submitContactForm({
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    message: String(body.message ?? ""),
    branchId: body.branchId ? String(body.branchId) : undefined,
    orderNumber: body.orderNumber ? String(body.orderNumber) : undefined,
    phone: body.phone ? String(body.phone) : undefined
  });
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
