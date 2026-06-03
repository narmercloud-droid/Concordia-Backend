export function enforceBranch(adminBranchId, orderBranchId) {
    if (adminBranchId !== orderBranchId) {
        throw new Error("Unauthorized: branch mismatch");
    }
}
