import type { Request } from "express";
import { wrap, fail } from "../../contracts/api.js";
import {
  createCampaign,
  listManagerCampaigns,
  updateCampaign
} from "../../services/customer/couponCampaign.service.ts";

function resolveBranchId(req: Request) {
  return String(req.query.branchId ?? req.body?.branchId ?? "").trim();
}

export const ManagerCouponsController = {
  list: wrap(async (req: Request) => {
    const branchId = resolveBranchId(req);
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const campaigns = await listManagerCampaigns(branchId);
    return { campaigns };
  }),

  create: wrap(async (req: Request) => {
    const branchId = resolveBranchId(req);
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const body = req.body ?? {};
    const title = String(body.title ?? "").trim();
    const discountType = String(body.discountType ?? "percent").trim();
    const discountValue = Number(body.discountValue ?? 0);
    if (!title) throw fail("INVALID_INPUT", "title is required");
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      throw fail("INVALID_INPUT", "discountValue must be positive");
    }

    try {
      const campaign = await createCampaign(branchId, {
        title,
        description: body.description,
        discountType,
        discountValue,
        minOrder: body.minOrder != null ? Number(body.minOrder) : 0,
        validFrom: body.validFrom ?? null,
        validUntil: body.validUntil ?? null,
        maxRedemptions: body.maxRedemptions != null ? Number(body.maxRedemptions) : null,
        newCustomersOnly: Boolean(body.newCustomersOnly),
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0
      });
      return { campaign };
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not create coupon");
    }
  }),

  update: wrap(async (req: Request) => {
    const branchId = resolveBranchId(req);
    const campaignId = String(req.params.id ?? "").trim();
    if (!branchId || !campaignId) throw fail("INVALID_INPUT", "branchId and id are required");
    try {
      const campaign = await updateCampaign(campaignId, branchId, req.body ?? {});
      return { campaign };
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not update coupon");
    }
  })
};
