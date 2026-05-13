import { prisma } from "../prisma/client.js";
export class AddressService {
    async addAddress(customerId, data) {
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { customerId },
                data: { isDefault: false }
            });
        }
        return prisma.address.create({
            data: { customerId, ...data }
        });
    }
    async updateAddress(customerId, addressId, data) {
        if (data.isDefault) {
            await prisma.address.updateMany({
                where: { customerId },
                data: { isDefault: false }
            });
        }
        return prisma.address.updateMany({
            where: { id: addressId, customerId },
            data
        });
    }
    async deleteAddress(customerId, addressId) {
        return prisma.address.deleteMany({
            where: { id: addressId, customerId }
        });
    }
    async listAddresses(customerId) {
        return prisma.address.findMany({
            where: { customerId },
            orderBy: { isDefault: "desc" }
        });
    }
}
export const addressService = new AddressService();
