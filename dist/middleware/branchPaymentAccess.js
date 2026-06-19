export function branchPaymentAccess(req, res, next) {
    const user = req.user;
    const branchId = req.params.branchId;
    if (!user?.role) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!branchId) {
        return res.status(400).json({ error: "branchId is required" });
    }
    if (user.role === "admin") {
        return next();
    }
    if (user.role === "manager" && user.branchId === branchId) {
        return next();
    }
    return res.status(403).json({ error: "Forbidden" });
}
