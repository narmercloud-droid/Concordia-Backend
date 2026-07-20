import type { Request } from "express";
import { wrap, fail } from "../contracts/api.js";
import {
  activateCustomerCoupon,
  claimCampaignCoupon,
  deactivateCustomerCoupon,
  getActivatedCoupons,
  listCustomerCoupons,
  validateCustomerCouponForOrder,
  validateCustomerCouponsForOrder
} from "../services/customer/customerCoupon.service.ts";
import { listActiveCampaignsForBranch } from "../services/customer/couponCampaign.service.ts";

export const CustomerCouponsController = {
  listMine: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const branchId = String(req.query.branchId ?? "").trim();
    if (!branchId) throw fail("INVALID_INPUT", "branchId is required");
    const coupons = await listCustomerCoupons(customerId, branchId);
    const activated = await getActivatedCoupons(customerId, branchId);
    const activatedCouponIds = activated.map((row) => row.id);
    return {
      coupons,
      activatedCouponIds,
      /** @deprecated use activatedCouponIds — kept for older clients */
      activatedCouponId: activatedCouponIds[0] ?? null,
      branchId
    };
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

  deactivate: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const customerCouponId = String(req.params.id ?? "").trim();
    if (!customerCouponId) throw fail("INVALID_INPUT", "Coupon id is required");
    try {
      return await deactivateCustomerCoupon(customerId, customerCouponId);
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Could not deactivate coupon");
    }
  }),

  validateForCheckout: wrap(async (req: Request) => {
    const customerId = (req as Request & { customer?: { id: string } }).customer?.id;
    if (!customerId) throw fail("UNAUTHORIZED", "Login required");
    const branchId = String(req.body?.branchId ?? "").trim();
    const orderTotal = Number(req.body?.orderTotal ?? 0);
    const idsFromBody = Array.isArray(req.body?.customerCouponIds)
      ? req.body.customerCouponIds.map((id: unknown) => String(id ?? "").trim()).filter(Boolean)
      : [];
    const singleId = String(req.body?.customerCouponId ?? "").trim();
    const customerCouponIds = idsFromBody.length > 0 ? idsFromBody : singleId ? [singleId] : [];

    if (!branchId || customerCouponIds.length === 0) {
      throw fail("INVALID_INPUT", "customerCouponIds and branchId are required");
    }
    try {
      if (customerCouponIds.length === 1) {
        return await validateCustomerCouponForOrder(
          customerId,
          customerCouponIds[0]!,
          branchId,
          orderTotal
        );
      }
      return await validateCustomerCouponsForOrder(
        customerId,
        customerCouponIds,
        branchId,
        orderTotal
      );
    } catch (err: any) {
      throw fail("INVALID_INPUT", err?.message ?? "Invalid coupon");
    }
  })
};
