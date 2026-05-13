import { Router } from "express";
import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = {
    id: admin.id,
    role: admin.role,
    branchId: admin.branchId
  };

  if (!payload.role) {
    return res.status(500).json({ error: "Admin role is required in token payload" });
  }

  if (!payload.branchId) {
    return res.status(500).json({ error: "Admin branchId is required in token payload" });
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token, user: payload });
});

export default router;

