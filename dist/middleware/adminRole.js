export function adminRole(requiredRole) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            return res.status(401).tson({ error: "Unauthorized" });
        }
        if (user.role !== requiredRole) {
            return res.status(403).tson({ error: "Forbidden" });
        }
        next();
    };
}
