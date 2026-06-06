import { prisma } from "../../prisma/client.ts";

export class AdminCustomersService {
  static async getAll(branchId: string, filters: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = filters;

    const where: any = {
      OR: [
        { orders: { some: { branchId } } }
      ]
    };
    if (search) {
      where.AND = [
        { OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } }
        ] }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        addresses: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.customer.count({ where });

    return { customers, total, page, limit };
  }

  static async getById(customerId: string, branchId: string) {
    return prisma.customer.findFirst({
      where: {
        id: customerId,
        OR: [
          { orders: { some: { branchId } } }
        ]
      },
      include: {
        addresses: true,
        orders: {
          where: { branchId },
          include: {
            items: {
              include: {
                item: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  static async update(customerId: string, _branchId: string, data: any) {
    return prisma.customer.update({
      where: { id: customerId },
      data
    });
  }

  static async toggleBan(customerId: string, _branchId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Customer not found");

    return customer;
  }

  static async getOrderHistory(customerId: string, branchId: string) {
    return prisma.order.findMany({
      where: { customerId, branchId },
      include: {
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}




