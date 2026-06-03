var _a;
import { AdminCustomersService } from "../../services/admin/adminCustomers.service.js";
import { wrap, fail } from "../../contracts/api.js";
import { adminCustomerFiltersSchema, adminCustomerUpdateSchema } from "../../validation/admin.schema.js";
import { idParamSchema } from "../../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export class AdminCustomersController {
}
_a = AdminCustomersController;
AdminCustomersController.getAll = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = adminCustomerFiltersSchema.safeParse(req.query);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customers = await AdminCustomersService.getAll(branchId, parsed.data);
    return customers;
});
AdminCustomersController.getById = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customer = await AdminCustomersService.getById(parsed.data.id, branchId);
    if (!customer)
        throw fail('NOT_FOUND', 'Customer not found');
    return customer;
});
AdminCustomersController.update = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedParams.error.issues));
    const parsedBody = adminCustomerUpdateSchema.safeParse(req.body);
    if (!parsedBody.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsedBody.error.issues));
    const customer = await AdminCustomersService.update(parsedParams.data.id, branchId, parsedBody.data);
    return customer;
});
AdminCustomersController.toggleBan = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const customer = await AdminCustomersService.toggleBan(parsed.data.id, branchId);
    return customer;
});
AdminCustomersController.getOrderHistory = wrap(async (req) => {
    const branchId = req.user?.branchId;
    if (!branchId)
        throw fail('MISSING_BRANCH', 'Branch ID is required');
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        throw fail('VALIDATION_ERROR', validationMessage(parsed.error.issues));
    const orders = await AdminCustomersService.getOrderHistory(parsed.data.id, branchId);
    return orders;
});
