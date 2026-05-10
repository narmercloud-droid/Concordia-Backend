"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header)
            return res.status(401).json({ message: "Missing token" });
        const token = header.split(" ")[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        // @ts-ignore
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
