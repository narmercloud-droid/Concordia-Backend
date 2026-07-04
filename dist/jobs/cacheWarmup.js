import { listBranchesForCustomer, getBranchMenuForCustomer, getBranchItemForCustomer } from "../services/customer/branchMenu.service.js";
import { getBranchBestsellers } from "../services/customer/bestsellers.service.js";
import logger from "../logger.js";
const HOT_BRANCHES = ["kempen", "concordia-kempen"];
const HOT_LANGS = ["de", "en"];
/** Prefetch branches + hot menus (with item options) into memory/Redis. */
export async function warmCustomerCaches() {
    try {
        await listBranchesForCustomer();
        for (const branchId of HOT_BRANCHES) {
            for (const lang of HOT_LANGS) {
                await getBranchMenuForCustomer(branchId, lang);
                try {
                    const bestsellers = await getBranchBestsellers(branchId, 8, lang);
                    const ids = bestsellers.items?.map((item) => item.id) ??
                        bestsellers.itemIds ??
                        [];
                    await Promise.all(ids.slice(0, 8).map((itemId) => getBranchItemForCustomer(branchId, itemId, lang)));
                }
                catch (warmItemErr) {
                    logger.debug({ branchId, lang, err: warmItemErr }, "Item cache warmup skipped");
                }
            }
        }
        logger.debug("Customer cache warmup completed");
    }
    catch (err) {
        logger.warn({ err }, "Customer cache warmup failed");
    }
}
