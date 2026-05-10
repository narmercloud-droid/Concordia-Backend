import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";

export async function validateKDSToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-kds-token"] as string;

  if (!token) {
    return res.status(401).json({ error: "Invalid or missing KDS token" });
  }

  try {
    const kds = await prisma.kitchenDisplay.findUnique({
      where: { kds_token: token },
    });

    if (!kds) {
      return res.status(401).json({ error: "Invalid or missing KDS token" });
    }

    (req as any).kds = {
      kds_id: kds.id,
      branch_id: kds.branch_id,
      name: kds.name,
    };

    next();
  } catch (error) {
    console.error("KDS auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}