import { prisma } from "../prisma/client.js";
import { randomUUID } from "crypto";

interface ScheduleData {
  day: number;
  openTime: string;
  closeTime: string;
  branchId: string;
}

export class ManagerDashboardService {
  // MENU ITEMS FOR BRANCH
  async menu(branchId: string): Promise<any[]> {
    return prisma.menuItem.findMany({
      include: { category: true }
    });
  }

  // UPDATE ITEM AVAILABILITY
  async setItemAvailability(branchId: string, itemId: string, available: boolean): Promise<any> {
    return prisma.menuItem.updateMany({
      where: { id: itemId },
      data: { available: available as any }
    } as any);
  }

  // ORDERS FOR BRANCH
  async orders(branchId: string, status?: string): Promise<any[]> {
    return prisma.order.findMany({
      where: {
        branchId,
        ...(status ? { status } : {})
      },
      include: {
        customer: true,
        items: true,
        courier: true
      } as any,
      orderBy: { createdAt: "desc" }
    } as any);
  }

  // COURIERS FOR BRANCH
  async couriers(branchId: string): Promise<any[]> {
    return prisma.courier.findMany({
      where: { branchId }
    });
  }

  // TERMINALS FOR BRANCH
  async terminals(branchId: string): Promise<any[]> {
    return prisma.terminal.findMany({
      where: { branchId }
    });
  }

  // OPENING HOURS
  async getSchedule(branchId: string) {
    return prisma.branchSchedule.findMany({
      where: { branchId }
    });
  }

  async updateSchedule(branchId: string, schedule: ScheduleData[]) {
    await prisma.branchSchedule.deleteMany({ where: { branchId } });

    return prisma.branchSchedule.createMany({
      data: schedule.map(s => ({ id: randomUUID(), ...s, branchId }))
    });
  }
}

export const managerDashboardService = new ManagerDashboardService();





