import type { AuthenticatedRequest } from "../globalTypes.ts";
import { ltvChurnService } from "../services/ltvChurn.service.ts";
import { wrap } from "../contracts/api.js";

export const LtvChurnController = {
  segment: wrap(async (req: AuthenticatedRequest) => {
    const customerId = req.params.customerId as string;
    const result = await ltvChurnService.segment(customerId);
    return result;
  }),

  branchSegments: wrap(async (req: AuthenticatedRequest) => {
    const branchId = req.user!.branchId;
    const result = await ltvChurnService.branchSegments(branchId);
    return result;
  }),
};







