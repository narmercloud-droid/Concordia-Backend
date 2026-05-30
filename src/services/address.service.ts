import { prisma } from "../prisma/client.js";

export class AddressService {
  async addAddress(customerId: string, data: any): Promise<any> {
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

  async updateAddress(customerId: string, addressId: string, data: any): Promise<any> {
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

  async deleteAddress(customerId: string, addressId: string): Promise<any> {
    return prisma.address.deleteMany({
      where: { id: addressId, customerId }
    });
  }

  async listAddresses(customerId: string): Promise<any[]> {
    return prisma.address.findMany({
      where: { customerId },
      orderBy: { isDefault: "desc" }
    });
  }
}

export const addressService = new AddressService();




