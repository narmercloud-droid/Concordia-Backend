import express from "express";
import {
  getBranchMenuForCustomer,
  getBranchItemForCustomer,
  listBranchesForCustomer
} from "../../services/customer/branchMenu.service.ts";
import { generateTimeSlots } from "../../services/scheduling/scheduling.service.ts";
import { quoteDelivery } from "../../services/customer/deliveryValidation.service.ts";
import { prisma } from "../../prisma/client.ts";
import { wrap } from "../../contracts/api.ts";

const router = express.Router();

router.get("/branches", wrap(async () => {
  return await listBranchesForCustomer();
}));

router.get("/branches/:branchId/menu", wrap(async (req) => {
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

router.post("/branches/:branchId/delivery-quote", wrap(async (req) => {
  const { address, orderTotal } = req.body ?? {};
  if (!address?.trim()) {
    throw { code: "INVALID_INPUT", message: "address is required" };
  }

  const total = Number(orderTotal ?? 0);
  return quoteDelivery(req.params.branchId, String(address), total);
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
