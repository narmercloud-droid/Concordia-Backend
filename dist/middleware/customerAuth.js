import { validateJwtPayload, verifyToken } from "../utils/jwt.js";
function attachCustomer(req, decoded) {
    req.user = decoded;
    req.customer = decoded;
}
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
        attachCustomer(req, decoded);
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
/** Parses customer JWT when present; continues as guest when missing or invalid. */
export function optionalCustomerAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header)
        return next();
    const token = header.split(" ")[1];
    if (!token)
        return next();
    try {
        const decoded = verifyToken(token);
        validateJwtPayload(decoded);
        if (decoded.role === "customer") {
            attachCustomer(req, decoded);
        }
    }
    catch {
        // ignore invalid optional auth
    }
    next();
}
