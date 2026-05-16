import { validateJwtPayload, verifyToken } from "../utils/jwt.js";
export function adminAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "Missing token" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        validateJwtPayload(decoded);
        if (decoded.role !== "admin" && decoded.role !== "manager") {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = decoded;
        next();
    }
    catch {
        return res.status(403).json({ error: "Invalid token" });
    }
}
