import express from "express";
import { getBranchMenuForCustomer, getBranchItemForCustomer, listBranchesForCustomer } from "../../services/customer/branchMenu.service.js";
import { generateTimeSlots } from "../../services/scheduling/scheduling.service.js";
import { getBranchDeliveryAreas, quoteDelivery } from "../../services/customer/deliveryValidation.service.js";
import { suggestAddresses } from "../../services/geo/geocode.service.js";
import { prisma } from "../../prisma/client.js";
import { wrap } from "../../contracts/api.js";
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
    const config = (branch.BranchConfig?.configJson ?? {});
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
