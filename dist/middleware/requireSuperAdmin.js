export function requireSuperAdmin(req, res, next) {
    const user = req.user;
    if (user?.role !== "admin") {
        return res.status(403).json({ error: "Super admin access required" });
    }
    next();
}
