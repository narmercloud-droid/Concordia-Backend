export function enforceBranch(adminBranchId: string, orderBranchId: string) {
  if (adminBranchId !== orderBranchId) {
    throw new Error("Unauthorized: branch mismatch");
  }
}
