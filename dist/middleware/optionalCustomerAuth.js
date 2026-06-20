import { validateJwtPayload, verifyToken } from "../utils/jwt.js";
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
        if (decoded.role !== "customer")
            return next();
        const user = decoded;
        req.user = user;
        req.customer = user;
    }
    catch {
        // Ignore invalid tokens — guest checkout still works.
    }
    next();
}
