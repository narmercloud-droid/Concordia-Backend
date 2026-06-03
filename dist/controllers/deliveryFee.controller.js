import { deliveryFeeService } from "../services/deliveryFee.service.js";
import { prisma } from "../prisma/client.js";
import { wrap, fail } from "../contracts/api.js";
export const DeliveryFeeController = {
    calculate: wrap(async (req) => {
        const { branchId, addressId, orderTotal } = req.body;
        const address = await prisma.address.findUnique({
            where: { id: addressId }
        });
        if (!address)
            throw fail('INVALID_INPUT', 'Invalid address');
        const result = await deliveryFeeService.calculate(branchId, {
            ...address,
            orderTotal
        });
        return result;
    }),
    setZone: wrap(async (req) => {
        const { branchId } = req.params;
        const zone = await prisma.deliveryZone.upsert({
            where: { branchId },
            update: req.body,
            create: { branchId, ...req.body }
        });
        return zone;
    }),
    getZone: wrap(async (req) => {
        const { branchId } = req.params;
        const zone = await prisma.deliveryZone.findUnique({ where: { branchId } });
        return zone;
    })
};
