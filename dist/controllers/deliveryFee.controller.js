import { deliveryFeeService } from "../services/deliveryFee.service.js";
import { prisma } from "../prisma/client.js";
import { success, fail } from "./controllerHelper.js";
export const DeliveryFeeController = {
    calculate: async (req, res, next) => {
        try {
            const { branchId, addressId, orderTotal } = req.body;
            const address = await prisma.address.findUnique({
                where: { id: addressId }
            });
            if (!address)
                return fail(res, "Invalid address", 400);
            const result = await deliveryFeeService.calculate(branchId, {
                ...address,
                orderTotal
            });
            return success(res, result);
        }
        catch (err) {
            next(err);
        }
    },
    setZone: async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const zone = await prisma.deliveryZone.upsert({
                where: { branchId },
                update: req.body,
                create: { branchId, ...req.body }
            });
            return success(res, zone);
        }
        catch (err) {
            next(err);
        }
    },
    getZone: async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const zone = await prisma.deliveryZone.findUnique({ where: { branchId } });
            return success(res, zone);
        }
        catch (err) {
            next(err);
        }
    }
};
