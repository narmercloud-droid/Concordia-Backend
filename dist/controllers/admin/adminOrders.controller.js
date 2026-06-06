var _a;
import { AdminOrdersService } from "../../services/admin/adminOrders.service.js";
import { wrap, fail } from "../../contracts/api.js";
import { adminOrderFiltersSchema, adminOrderStatusSchema, adminAssignCourierSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class AdminOrdersController {
}
_a = AdminOrdersController;
AdminOrdersController.getAll = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = adminOrderFiltersSchema.safeParse(req.query);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const filters = {
        ...parsed.data,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    };
    const orders = await AdminOrdersService.getAll(branchId, filters);
    return orders;
});
AdminOrdersController.getById = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const order = await AdminOrdersService.getById(parsed.data.id, branchId);
    if (!order)
        throw fail('NOT_FOUND', 'Order not found');
    return order;
});
AdminOrdersController.updateStatus = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminOrderStatusSchema.safeParse(req.body);
    if (!parsedBody.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const order = await AdminOrdersService.updateStatus(parsedParams.data.id, branchId, parsedBody.data.status, parsedBody.data.estimatedTime);
    return order;
});
AdminOrdersController.assignCourier = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminAssignCourierSchema.safeParse(req.body);
    if (!parsedBody.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const order = await AdminOrdersService.assignCourier(parsedParams.data.id, branchId, parsedBody.data.courierId);
    return order;
});
