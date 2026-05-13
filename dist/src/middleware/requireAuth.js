import { validateJwtPayload, verifyToken } from "../utils/jwt";
export function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header)
            return res.status(401).json({ message: "Missing token" });
        const token = header.split(" ")[1];
        const decoded = verifyToken(token);
        validateJwtPayload(decoded);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
