import express from "express";
import {
  getBranchMenuForCustomer,
  getBranchItemForCustomer,
  listBranchesForCustomer
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
import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.ts";

const router = express.Router();

function publicCache(maxAgeSec: number) {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Cache-Control", `public, max-age=${maxAgeSec}, stale-while-revalidate=60`);
    next();
  };
}

router.get("/branches", publicCache(60), wrap(async () => {
  return await listBranchesForCustomer();
}));

router.get("/branches/:branchId/menu", publicCache(120), wrap(async (req) => {
  const branch = await prisma.branch.findUnique({
    where: { id: req.params.branchId },
    include: { BranchConfig: true }
  });

  if (!branch) {
    throw { code: "NOT_FOUND", message: "Branch not found" };
  }

  const config = (branch.BranchConfig?.configJson ?? {}) as Record<string, unknown>;
  if (config.status === "coming_soon") {
    throw { code: "FORBIDDEN", message: "This branch is not available yet" };
  }

  const categories = await getBranchMenuForCustomer(req.params.branchId);
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

  if (q.length < 3) {
    return { suggestions: [] };
  }

  const suggestions = await suggestAddresses(q, { postalCode });
  return { suggestions };
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

router.get("/branches/:branchId/bestsellers", publicCache(300), wrap(async (req) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 6) || 6, 1), 12);
  return getBranchBestsellers(req.params.branchId, limit);
}));

router.get("/branches/:branchId/items/:itemId/also-popular", wrap(async (req) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId)) {
    throw { code: "INVALID_INPUT", message: "Invalid item id" };
  }
  return getAlsoPopularItems(req.params.branchId, itemId);
}));

router.get("/branches/:branchId/items/:itemId", wrap(async (req) => {
  const itemId = Number(req.params.itemId);
  if (Number.isNaN(itemId)) {
    throw { code: "INVALID_INPUT", message: "Invalid item id" };
  }

  const item = await getBranchItemForCustomer(req.params.branchId, itemId);
  if (!item) {
    throw { code: "NOT_FOUND", message: "Item not found" };
  }

  return item;
}));

export default router;
