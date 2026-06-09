import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

const JWT_SECRET = env.JWT_SECRET as string;

export type AuthJwtPayload = {
  id: string;
  role: string;
  branchId: string | null;
};

export type TerminalActivationJwtPayload = {
  branchId: string;
  type: string;
};

export type JwtPayload = AuthJwtPayload | TerminalActivationJwtPayload;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateJwtPayload(payload: unknown): asserts payload is AuthJwtPayload {
  if (!isRecord(payload)) throw new Error("Invalid token payload");

  const id = payload.id;
  const role = payload.role;
  const branchId = payload.branchId;

  if (typeof id !== "string" || !id) throw new Error("Invalid token payload: id");
  if (typeof role !== "string" || !role) throw new Error("Invalid token payload: role");
  if (branchId !== null && typeof branchId !== "string") {
    throw new Error("Invalid token payload: branchId");
  }
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRES_IN || "7d"
  } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as jwt.Secret);
}
