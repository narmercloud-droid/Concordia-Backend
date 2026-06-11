import express from "express";
import { getBranchMenuForCustomer, getBranchItemForCustomer, listBranchesForCustomer, peekBranchMenuCache } from "../../services/customer/branchMenu.service.js";
import { generateTimeSlots } from "../../services/scheduling/scheduling.service.js";
import { getBranchDeliveryAreas, quoteDelivery } from "../../services/customer/deliveryValidation.service.js";
import { suggestAddresses } from "../../services/geo/geocode.service.js";
import { getAlsoPopularItems, getBranchBestsellers } from "../../services/customer/bestsellers.service.js";
import { validateDiscountCode } from "../../services/customer/discountCode.service.js";
import { createGiftCardPurchase } from "../../services/customer/giftCard.service.js";
import { getFreeDrinkOptions } from "../../services/customer/freeDrink.service.js";
import { getBranchGoogleReviews } from "../../services/customer/googleReviews.service.js";
import { submitContactForm } from "../../services/customer/contact.service.js";
import contactRateLimit from "../../middleware/contactRateLimit.js";
import { resolveMenuLanguage } from "../../services/customer/menuTranslation.service.js";
import { prisma } from "../../prisma/client.js";
import { wrap } from "../../contracts/api.js";
function menuLang(req) {
    return resolveMenuLanguage(String(req.query.lang ?? ""));
}
const router = express.Router();
function publicCache(maxAgeSec, staleSec = 300) {
    return (_req, res, next) => {
        res.setHeader("Cache-Control", `public, max-age=${maxAgeSec}, stale-while-revalidate=${staleSec}`);
        next();
    };
}
router.get("/branches", publicCache(300, 600), wrap(async () => {
    return await listBranchesForCustomer();
}));
router.get("/branches/:branchId/menu", publicCache(600, 900), wrap(async (req) => {
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
    const areas = await getBranchDeliveryAreas(req.params.branchId);
    return { areas };
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
    const config = (branch?.BranchConfig?.configJson ?? {});
    const nearCity = city || String(config.city ?? "Kempen");
    const lat = Number(config.lat ?? 0);
    const lng = Number(config.lng ?? 0);
    const suggestions = await suggestAddresses(q, {
        postalCode,
        city: nearCity,
        nearCity,
        lat: Number.isFinite(lat) && lat !== 0 ? lat : undefined,
        lng: Number.isFinite(lng) && lng !== 0 ? lng : undefined
    });
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
    }
    catch (err) {
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
    }
    catch (err) {
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
router.get("/branches/:branchId/bestsellers", publicCache(600, 900), wrap(async (req) => {
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
