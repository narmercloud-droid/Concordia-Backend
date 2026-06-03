import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
const JWT_SECRET = env.JWT_SECRET;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
export function validateJwtPayload(payload) {
    if (!isRecord(payload))
        throw new Error("Invalid token payload");
    const id = payload.id;
    const role = payload.role;
    const branchId = payload.branchId;
    if (typeof id !== "string" || !id)
        throw new Error("Invalid token payload: id");
    if (typeof role !== "string" || !role)
        throw new Error("Invalid token payload: role");
    if (typeof branchId !== "string" || !branchId)
        throw new Error("Invalid token payload: branchId");
}
export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN || "7d"
    });
}
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
