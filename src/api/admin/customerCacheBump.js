const CUSTOMER_BRANCH_IDS = ["concordia-kempen", "concordia-straelen"];

export async function bumpBranchListCache() {
  const { invalidateBranchListCache } = await import(
    "../../services/customer/branchMenu.service.ts"
  );
  invalidateBranchListCache();
}

export async function bumpBranchMenuCache(branchId) {
  const { invalidateBranchMenuCache } = await import(
    "../../services/customer/branchMenu.service.ts"
  );
  invalidateBranchMenuCache(branchId);
}

export async function bumpAllBranchMenus() {
  for (const branchId of CUSTOMER_BRANCH_IDS) {
    await bumpBranchMenuCache(branchId);
  }
}
