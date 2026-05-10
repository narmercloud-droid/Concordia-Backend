"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await prisma_1.default.adminUser.findUnique({
        where: { email },
    });
    if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcryptjs_1.default.compare(password, admin.password);
    if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
});
exports.default = router;
