import type { Request } from "express";
import { wrap, fail } from "../../contracts/api.js";
import {
  branchCustomersToCsv,
  getBranchCustomerStats,
  getCustomerOrderHistory,
  listBranchCustomers,
  reconcileAllBranchCustomers
} from "../../services/customer/branchCustomer.service.ts";
import {
  runBirthdayForBranch,
  runWinBackForBranch
} from "../../services/customer/branchAutomation.service.ts";

function branchId(req: Request) {
  return (req as any).managerBranchId as string;
}

export const getCustomers = wrap(async (req: Request) => {
  const marketingOnly = req.query.marketingOnly === "true";
  const search = String(req.query.search ?? "");
  const customers = await listBranchCustomers(branchId(req), {
    marketingOnly,
    search: search || undefined
  });
  const stats = await getBranchCustomerStats(branchId(req));
  return { customers, stats };
});

export const exportCustomers = wrap(async (req: Request) => {
  const marketingOnly = req.query.marketingOnly === "true";
  const customers = await listBranchCustomers(branchId(req), { marketingOnly });
  const csv = branchCustomersToCsv(customers);
  return { csv, filename: `concordia-customers-${branchId(req)}.csv` };
});

export const getCustomerOrders = wrap(async (req: Request) => {
  const phone = decodeURIComponent(req.params.phone ?? "").trim();
  if (!phone) throw fail("INVALID_INPUT", "phone is required");

  const orders = await getCustomerOrderHistory(branchId(req), phone);
  return { orders };
});

export const runBranchAutomation = wrap(async (req: Request) => {
  const id = branchId(req);
  const winBack = await runWinBackForBranch(id);
  const birthday = await runBirthdayForBranch(id);
  return { winBack, birthday };
});

export const reconcileCustomerStats = wrap(async (req: Request) => {
  const user = (req as any).user;
  if (user?.role !== "admin") {
    throw fail("FORBIDDEN", "Only super admin can reconcile customer stats");
  }

  const result = await reconcileAllBranchCustomers(branchId(req));
  const stats = await getBranchCustomerStats(branchId(req));
  return { ...result, stats };
});
