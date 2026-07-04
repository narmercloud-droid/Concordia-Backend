import {
  listBranchesForCustomer,
  getBranchMenuForCustomer,
  getBranchItemForCustomer
} from "../services/customer/branchMenu.service.ts";
import { getBranchBestsellers } from "../services/customer/bestsellers.service.ts";
import logger from "../logger.ts";

const HOT_BRANCHES = ["kempen", "concordia-kempen"] as const;
const HOT_LANGS = ["de", "en"] as const;

/** Prefetch branches + hot menus (with item options) into memory/Redis. */
export async function warmCustomerCaches(): Promise<void> {
  try {
    await listBranchesForCustomer();
    for (const branchId of HOT_BRANCHES) {
      for (const lang of HOT_LANGS) {
        await getBranchMenuForCustomer(branchId, lang);
        try {
          const bestsellers = await getBranchBestsellers(branchId, 8, lang);
          const ids =
            bestsellers.items?.map((item) => item.id) ??
            bestsellers.itemIds ??
            [];
          await Promise.all(
            ids.slice(0, 8).map((itemId) => getBranchItemForCustomer(branchId, itemId, lang))
          );
        } catch (warmItemErr) {
          logger.debug({ branchId, lang, err: warmItemErr }, "Item cache warmup skipped");
        }
      }
    }
    logger.debug("Customer cache warmup completed");
  } catch (err) {
    logger.warn({ err }, "Customer cache warmup failed");
  }
}
