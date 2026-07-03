/**
 * Rebuild BranchCustomer orderCount / totalSpent / totalSaved from live orders.
 *
 * Usage:
 *   node scripts/reconcile-branch-customers.mjs
 *   node scripts/reconcile-branch-customers.mjs concordia-kempen
 */
import dotenv from "dotenv";
import { reconcileAllBranchCustomers } from "../dist/services/customer/branchCustomer.service.js";

dotenv.config();

const branchId = process.argv[2]?.trim() || undefined;

const result = await reconcileAllBranchCustomers(branchId);
console.log(
  `Rebuilt ${result.updated} order profile(s), linked ${result.registered} registered customer(s), removed ${result.removed} orphan record(s)${branchId ? ` for ${branchId}` : ""}.`
);
