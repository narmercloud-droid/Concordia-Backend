import type { Request } from "express";
import { wrap, fail } from "../contracts/api.js";
import {
  activateCustomerCoupon,
  claimCampaignCoupon,
  getActivatedCoupon,
  listCustomerCoupons,
  validateCustomerCouponForOrder
} from "../services/customer/customerCoupon.service.ts";
import { listActiveCampaignsForBranch } from "../services/customer/couponCampaign.service.ts";

export const CustomerCouponsController = {
  listMine: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const branchId = String(req.query.branchId ?? "").trim();
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const coupons = await listCustomerCoupons(customerId, branchId);
    const activated = await getActivatedCoupon(customerId, branchId);
    return { coupons, activatedCouponId: activated?.id ?? null, branchId };
  }),

  listAvailable: wrap(async (req: Request) => {
    const branchId = String(req.query.branchId ?? "").trim();
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id ?? null;
    const campaigns = await listActiveCampaignsForBranch(branchId, customerId);
    return { campaigns };
  }),

  claim: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const campaignId = String(req.params.campaignId ?? "").trim();
    const branchId = String(req.body?.branchId ?? req.query.branchId ?? "").trim();
    if (!campaignId) throw fail("INVALID_INPUT", "campaignId is required");
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    try {
      const result = await claimCampaignCoupon(customerId, campaignId, branchId);
      return result;
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not claim coupon");
    }
  }),

  activate: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const customerCouponId = String(req.params.id ?? "").trim();
    if (!customerCouponId) throw fail("INVALID_INPUT", "Coupon id is required");
    try {
      return await activateCustomerCoupon(customerId, customerCouponId);
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not activate coupon");
    }
  }),

  validateForCheckout: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const customerCouponId = String(req.body?.customerCouponId ?? "").trim();
    const branchId = String(req.body?.branchId ?? "").trim();
    const orderTotal = Number(req.body?.orderTotal ?? 0);
    if (!customerCouponId || !branchId) {
      throw fail("INVALID_INPUT", "customerCouponId and branchId are required");
    }
    try {
      return await validateCustomerCouponForOrder(
        customerId,
        customerCouponId,
        branchId,
        orderTotal
      );
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Invalid coupon");
    }
  })
};
