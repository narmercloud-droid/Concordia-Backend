"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
const db_1 = __importDefault(require("../db"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
async function loginAdmin(email, password) {
    const result = await db_1.default.query("SELECT * FROM admins WHERE email = $1 LIMIT 1", [email]);
    const admin = result.rows[0];
    if (!admin)
        throw new Error("Invalid credentials");
    const match = await (0, hash_1.comparePassword)(password, admin.password_hash);
    if (!match)
        throw new Error("Invalid credentials");
    const token = (0, jwt_1.signToken)({ id: admin.id, role: "admin" });
    return { admin, token };
}
