import { listBranchesForCustomer, getBranchMenuForCustomer } from "../services/customer/branchMenu.service.js";
import logger from "../logger.js";
const HOT_BRANCHES = ["kempen", "concordia-kempen"];
const HOT_LANGS = ["de", "en"];
/** Prefetch branches + Kempen menu into memory/Redis so first customer hit is fast. */
export async function warmCustomerCaches() {
    try {
        await listBranchesForCustomer();
        for (const branchId of HOT_BRANCHES) {
            for (const lang of HOT_LANGS) {
                await getBranchMenuForCustomer(branchId, lang);
            }
        }
        logger.debug("Customer cache warmup completed");
    }
    catch (err) {
        logger.warn({ err }, "Customer cache warmup failed");
    }
}
