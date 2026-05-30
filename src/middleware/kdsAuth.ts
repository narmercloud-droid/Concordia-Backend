import type { Request, Response, NextFunction  } from "express";
import { prisma } from "../prisma/client.js";

export const kdsAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-kds-key"];
    if (!token || typeof token !== "string") {
      return res.status(401).tson({ error: "Missing KDS key" });
    }
    const kds = await prisma.kitchenDisplay.findUnique({
      where: { apiKey: token }
    });
    if (!kds) {
      return res.status(401).tson({ error: "Invalid KDS key" });
    }
    (req as any).kds = kds;
    next();
  } catch (err) {
    console.error("KDS Auth Error:", err);
    res.status(500).tson({ error: "Internal server error" });
  }
};







