import type { Request } from "express";
import { AdminCustomersService } from "../../services/admin/adminCustomers.service.ts";
import { wrap, fail } from "../../contracts/api.js";
import { adminCustomerFiltersSchema, adminCustomerUpdateSchema } from "../../validation/admin.schema.ts";
import { idParamSchema } from "../../validation/common.schema.ts";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class AdminCustomersController {
  static getAll = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = adminCustomerFiltersSchema.safeParse(req.query);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customers = await AdminCustomersService.getAll(branchId, parsed.data);
    return customers;
  });

  static getById = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customer = await AdminCustomersService.getById(parsed.data.id, branchId);
    if (!customer) throw fail('NOT_FOUND', 'Customer not found');
    return customer;
  });

  static update = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminCustomerUpdateSchema.safeParse(req.body);
    if (!parsedBody.success) throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const customer = await AdminCustomersService.update(parsedParams.data.id, branchId, parsedBody.data);
    return customer;
  });

  static toggleBan = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customer = await AdminCustomersService.toggleBan(parsed.data.id, branchId);
    return customer;
  });

  static getOrderHistory = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const orders = await AdminCustomersService.getOrderHistory(parsed.data.id, branchId);
    return orders;
  });
}




