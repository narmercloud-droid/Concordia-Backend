import type { Request } from "express";
import { AdminOrdersService } from "../../services/admin/adminOrders.service.ts";
import { wrap, fail } from "../../contracts/api.js";
import { adminOrderFiltersSchema, adminOrderStatusSchema, adminAssignCourierSchema } from "../../validation/admin.schema.ts";
import { idParamSchema } from "../../validation/common.schema.ts";

const validationMessage = (issues: { message: string }[]) =>
  issues.map((i) => i.message).join(", ") || "Invalid input";

export class AdminOrdersController {
  static getAll = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = adminOrderFiltersSchema.safeParse(req.query);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const filters = {
      ...parsed.data,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    };
    const orders = await AdminOrdersService.getAll(branchId, filters);
    return orders;
  });

  static getById = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const order = await AdminOrdersService.getById(parsed.data.id, branchId);
    if (!order) throw fail('NOT_FOUND', 'Order not found');
    return order;
  });

  static updateStatus = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminOrderStatusSchema.safeParse(req.body);
    if (!parsedBody.success) throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const order = await AdminOrdersService.updateStatus(parsedParams.data.id, branchId, parsedBody.data.status, parsedBody.data.estimatedTime);
    return order;
  });

  static assignCourier = wrap(async (req: Request) => {
    const branchId = (req as any).user?.branchId;
    if (!branchId) throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminAssignCourierSchema.safeParse(req.body);
    if (!parsedBody.success) throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const order = await AdminOrdersService.assignCourier(parsedParams.data.id, branchId, parsedBody.data.courierId);
    return order;
  });
}




