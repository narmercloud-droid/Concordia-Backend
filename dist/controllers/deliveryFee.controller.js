import { deliveryFeeService } from "../services/deliveryFee.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
import { deliveryFeeCalculateBodySchema, deliveryFeeZoneBodySchema } from "../validation/deliveryFee.schema.js";
import { branchIdParamSchema } from "../validation/common.schema.js";
const validationMessage = (issues) => issues.map((i) => i.message).join(", ") || "Invalid input";
export const DeliveryFeeController = {
    calculate: async (req, res, next) => {
        try {
            const parsed = deliveryFeeCalculateBodySchema.safeParse(req.body);
            if (!parsed.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsed.error.issues), 400);
            }
            const { branchId, addressId, orderTotal } = parsed.data;
            const address = await prisma.address.findUnique({
                where: { id: addressId }
            });
            if (!address)
                return fail(res, "INVALID_ADDRESS", "Invalid address", 400);
            const result = await deliveryFeeService.calculate(branchId, {
                ...address,
                orderTotal
            });
            return success(res, result, "Delivery fee calculated");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    setZone: async (req, res, next) => {
        try {
            const parsedParams = branchIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const parsedBody = deliveryFeeZoneBodySchema.safeParse(req.body);
            if (!parsedBody.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedBody.error.issues), 400);
            }
            const { branchId } = parsedParams.data;
            const zone = await prisma.deliveryZone.upsert({
                where: { branchId },
                update: parsedBody.data,
                create: {
                    branch: { connect: { id: branchId } },
                    ...parsedBody.data
                }
            });
            return success(res, zone, "Zone saved");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    },
    getZone: async (req, res, next) => {
        try {
            const parsedParams = branchIdParamSchema.safeParse(req.params);
            if (!parsedParams.success) {
                return fail(res, "VALIDATION_ERROR", validationMessage(parsedParams.error.issues), 400);
            }
            const { branchId } = parsedParams.data;
            const zone = await prisma.deliveryZone.findUnique({
                where: { branchId }
            });
            return success(res, zone, "Zone fetched");
        }
        catch (err) {
            return fail(res, "UNKNOWN_ERROR", err.message, 500);
        }
    }
};
