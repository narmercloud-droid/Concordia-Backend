import jwt from "jsonwebtoken";
import { validateJwtPayload, verifyToken } from "../utils/jwt.js";
export function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Missing token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_err) {
        void _err;
        return res.status(401).json({ error: "Invalid token" });
    }
}
export function verifyAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Missing token" });
    const token = header.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        validateJwtPayload(decoded);
        if (decoded.role !== "admin" && decoded.role !== "manager") {
            return res.status(403).json({ error: "Admin access required" });
        }
        req.user = decoded;
        next();
    }
    catch {
        return res.status(403).json({ error: "Invalid token" });
    }
}
