var _a;
import { AdminCouriersService } from "../../services/admin/adminCouriers.service.js";
import { wrap, fail } from "../../contracts/api.js";
import { adminCourierCreateSchema, adminCourierUpdateSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class AdminCouriersController {
}
_a = AdminCouriersController;
AdminCouriersController.getAll = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const couriers = await AdminCouriersService.getAll(branchId);
    return couriers;
});
AdminCouriersController.getById = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const courier = await AdminCouriersService.getById(parsed.data.id, branchId);
    if (!courier)
        throw fail('NOT_FOUND', 'Courier not found');
    return courier;
});
AdminCouriersController.create = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = adminCourierCreateSchema.safeParse(req.body);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const courier = await AdminCouriersService.create(branchId, parsed.data);
    return courier;
});
AdminCouriersController.update = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminCourierUpdateSchema.safeParse(req.body);
    if (!parsedBody.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const courier = await AdminCouriersService.update(parsedParams.data.id, branchId, parsedBody.data);
    return courier;
});
AdminCouriersController.toggleActive = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const courier = await AdminCouriersService.toggleActive(parsed.data.id, branchId);
    return courier;
});
AdminCouriersController.getOrderHistory = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const orders = await AdminCouriersService.getOrderHistory(parsed.data.id, branchId);
    return orders;
});
