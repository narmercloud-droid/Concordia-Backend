import { listBranchesForCustomer, getBranchMenuForCustomer } from "../services/customer/branchMenu.service.ts";
import logger from "../logger.ts";

const HOT_BRANCHES = ["kempen", "concordia-kempen"] as const;
const HOT_LANGS = ["de", "en"] as const;

/** Prefetch branches + Kempen menu into memory/Redis so first customer hit is fast. */
export async function warmCustomerCaches(): Promise<void> {
  try {
    await listBranchesForCustomer();
    for (const branchId of HOT_BRANCHES) {
      for (const lang of HOT_LANGS) {
        await getBranchMenuForCustomer(branchId, lang);
      }
    }
    logger.debug("Customer cache warmup completed");
  } catch (err) {
    logger.warn({ err }, "Customer cache warmup failed");
  }
}
