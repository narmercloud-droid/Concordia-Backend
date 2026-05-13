import { validateJwtPayload, verifyToken } from "../utils/jwt.js";
export function customerAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Unauthorized" });
    const token = header.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        validateJwtPayload(decoded);
        if (decoded.role !== "customer")
            return res.status(403).json({ error: "Forbidden" });
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
