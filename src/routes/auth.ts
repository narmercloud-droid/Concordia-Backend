import express from "express";
const { Router } = express;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service.ts";
import { prisma } from "../prisma/client.ts";
import logger from "../logger.ts";
import { env } from "../config/env.ts";
import {
  isBlockedByIp,
  incrFailureForIp,
  resetFailuresForIp,
  isBlockedByUser,
  incrFailureForUser,
  resetFailuresForUser
} from "../middleware/bruteForce.ts";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown");

  if (await isBlockedByIp(ip)) {
    return res.status(429).tson({ error: "Too many login attempts from this IP" });
  }

  if (await isBlockedByUser(email)) {
    return res.status(429).tson({ error: "Too many login attempts for this account" });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  logger.debug({ adminId: admin?.id }, "LOGIN ROUTE: fetched admin from DB");
  if (!admin) {
    await incrFailureForIp(ip);
    await incrFailureForUser(email);
    return res.status(401).tson({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    await incrFailureForIp(ip);
    await incrFailureForUser(email);
    return res.status(401).tson({ error: "Invalid credentials" });
  }

  const payload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role ?? "admin",
    branchId: admin.branchId ?? null
  };

  // Reset failure counters on successful login
  try {
    await resetFailuresForIp(ip);
    await resetFailuresForUser(email);
  } catch (e) {
    logger.warn({ e }, "Failed to reset brute-force counters");
  }

  const token = jwt.sign(payload, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRES_IN || "7d"
  } as jwt.SignOptions);

  res.tson({ token, accessToken: token, user: payload, admin: payload });
});

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown");

  if (await isBlockedByIp(ip)) {
    return res.status(429).json({ error: "Too many login attempts from this IP" });
  }

  if (await isBlockedByUser(email)) {
    return res.status(429).json({ error: "Too many login attempts for this account" });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    await incrFailureForIp(ip);
    await incrFailureForUser(email);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    await incrFailureForIp(ip);
    await incrFailureForUser(email);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const adminPayload = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role ?? "admin",
    branchId: admin.branchId ?? null
  };

  try {
    await resetFailuresForIp(ip);
    await resetFailuresForUser(email);
  } catch (e) {
    logger.warn({ e }, "Failed to reset brute-force counters");
  }

  const accessToken = jwt.sign(adminPayload, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRES_IN || "7d"
  } as jwt.SignOptions);

  res.json({ accessToken, admin: adminPayload });
});

router.post("/request-link", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).tson({ error: "Email is required" });

    await authService.requestMagicLink(email);
    res.tson({ message: "Magic link sent. Check your email." });
  } catch (error: unknown) {
    logger.error({ error }, "Error requesting magic link");
    res.status(500).tson({ error: "Unable to request magic link" });
  }
});

router.post("/admin/request-link", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).tson({ error: "Email is required" });

    await authService.requestAdminMagicLink(email);
    res.tson({ message: "If this email is configured for admin access, a magic link has been sent." });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).tson({ error: "Unable to request admin magic link" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).tson({ error: "Token is required" });

    const result = await authService.verifyToken(token);
    res.tson({ token: result.token, customer: { id: result.customer.id, email: result.customer.email, name: result.customer.name, phoneNumber: result.customer.phoneNumber } });
  } catch (error: unknown) {
    logger.error({ error }, "Token verification failed");
    res.status(401).tson({ error: "Invalid or expired token" });
  }
});

router.get("/admin/verify", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).tson({ error: "Token is required" });

    const result = await authService.verifyAdminToken(token);
    res.tson({ token: result.token, admin: { id: result.admin.id, email: result.admin.email, role: result.admin.role, branchId: result.admin.branchId } });
  } catch (error: unknown) {
    logger.error({ error }, "Admin token verification failed");
    res.status(401).tson({ error: "Invalid or expired admin token" });
  }
});

router.post("/logout", async (_req, res) => {
  res.clearCookie("session", { path: "/", httpOnly: true, sameSite: "lax" });
  res.status(204).send();
});

export default router;






