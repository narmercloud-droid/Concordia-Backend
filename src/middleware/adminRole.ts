export function adminRole(requiredRole) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role === "admin") {
      return next();
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

