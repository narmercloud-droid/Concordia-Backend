import type { Request } from "express";
import { z } from "zod";
import { prisma } from "../prisma/client.js";

const branchIdSchema = z.string().uuid().describe("Valid branch UUID");

export async function getBranchContext(req: Request): Promise<string> {
  const branchIdCandidate =
    req.user?.branchId ||
    (req.body && typeof req.body.branchId === "string" ? req.body.branchId : undefined) ||
    (req.params && typeof req.params.branchId === "string" ? req.params.branchId : undefined) ||
    (req.query && typeof req.query.branchId === "string" ? req.query.branchId : undefined);

  if (branchIdCandidate) {
    const parsed = branchIdSchema.safeParse(branchIdCandidate);
    if (!parsed.success) {
      throw new Error("Invalid branchId");
    }
    return parsed.data;
  }

  if (req.body?.addressId) {
    throw new Error("Branch context cannot be resolved from addressId");
  }

  if (req.body?.orderId) {
    const order = await prisma.order.findUnique({ where: { id: req.body.orderId } });
    if (!order) throw new Error("Order not found");
    return branchIdSchema.parse(order.branchId);
  }

  throw new Error("Missing branchId context");
}





