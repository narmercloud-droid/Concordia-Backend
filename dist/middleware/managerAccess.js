export function resolveManagerBranchId(req) {
    const user = req.user;
    if (!user)
        return null;
    const requested = String(req.query.branchId ?? req.body?.branchId ?? "");
    if (user.role === "admin") {
        return requested || user.branchId || "concordia-kempen";
    }
    if (user.role === "manager") {
        return user.branchId;
    }
    return null;
}
export function managerAccess(req, res, next) {
    const user = req.user;
    if (!user?.role) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (user.role !== "admin" && user.role !== "manager") {
        return res.status(403).json({ error: "Forbidden" });
    }
    const branchId = resolveManagerBranchId(req);
    if (!branchId) {
        return res.status(403).json({ error: "No branch assigned" });
    }
    req.managerBranchId = branchId;
    next();
}
