import * as jwt from "jsonwebtoken";
export function adminAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "Missing token" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        if (decoded.type !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = decoded;
        next();
    }
    catch {
        return res.status(403).json({ error: "Invalid token" });
    }
}
