import { wrap, fail } from "../../contracts/api.js";
import { createCampaign, listManagerCampaigns, updateCampaign } from "../../services/customer/couponCampaign.service.js";
import { resolveManagerBranchId } from "../../middleware/managerAccess.js";
function branchId(req) {
    const id = resolveManagerBranchId(req);
    if (!id)
        throw fail("INVALID_INPUT", "branchId is required");
    return id;
}
export const ManagerCouponsController = {
    list: wrap(async (req) => {
        const campaigns = await listManagerCampaigns(branchId(req));
        return { campaigns };
    }),
    create: wrap(async (req) => {
        const resolvedBranchId = branchId(req);
        const body = req.body ?? {};
        const title = String(body.title ?? "").trim();
        const discountType = String(body.discountType ?? "percent").trim();
        const discountValue = Number(body.discountValue ?? 0);
        if (!title)
            throw fail("INVALID_INPUT", "title is required");
        if (!Number.isFinite(discountValue) || discountValue <= 0) {
            throw fail("INVALID_INPUT", "discountValue must be positive");
        }
        try {
            const campaign = await createCampaign(resolvedBranchId, {
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
        }
        catch (err) {
            throw fail("INVALID_INPUT", err?.message ?? "Could not create coupon");
        }
    }),
    update: wrap(async (req) => {
        const resolvedBranchId = branchId(req);
        const campaignId = String(req.params.id ?? "").trim();
        if (!campaignId)
            throw fail("INVALID_INPUT", "id is required");
        try {
            const campaign = await updateCampaign(campaignId, resolvedBranchId, req.body ?? {});
            return { campaign };
        }
        catch (err) {
            throw fail("INVALID_INPUT", err?.message ?? "Could not update coupon");
        }
    })
};
