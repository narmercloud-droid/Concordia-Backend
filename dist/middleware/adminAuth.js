"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    // Example simple admin check
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
exports.adminAuth = adminAuth;
