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
  `Reconciled ${result.updated} branch customer record(s)${branchId ? ` for ${branchId}` : ""}.`
);
