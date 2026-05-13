import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export type AuthJwtPayload = {
  id: string;
  role: string;
  branchId: string;
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
  if (typeof branchId !== "string" || !branchId) throw new Error("Invalid token payload: branchId");
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
