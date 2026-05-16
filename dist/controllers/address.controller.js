import { addressService } from "../services/address.service.js";
import { success, fail } from "./controllerHelper.js";
import { addressBodySchema } from "../validation/address.schema.js";
import { idParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const AddressController = {
    add: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsed = addressBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const address = await addressService.addAddress(customerId, parsed.data);
            return success(res, address, "Address added");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    update: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = addressBodySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            await addressService.updateAddress(customerId, parsedParams.data.id, parsedBody.data);
            return success(res, { success: true }, "Address updated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    delete: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const parsedParams = idParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            await addressService.deleteAddress(customerId, parsedParams.data.id);
            return success(res, { success: true }, "Address deleted");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    list: async (req, res, next) => {
        try {
            const customerId = req.user.id;
            const list = await addressService.listAddresses(customerId);
            return success(res, list, "Addresses listed");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
