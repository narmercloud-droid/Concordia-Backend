import { prisma } from "../prisma/client.js";

interface LocationData {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  updatedAt?: Date;
}

interface TrackingInfo {
  orderStatus: string;
  courierLocation: any;
  timeline: any[];
}

export class CourierTrackingService {
  async updateLocation(courierId: string, data: LocationData): Promise<any> {
    return prisma.courierLocation.upsert({
      where: { courierId },
      update: { ...data },
      create: { courierId, ...data }
    });
  }

  async getCourierLocation(courierId: string): Promise<any> {
    return prisma.courierLocation.findUnique({
      where: { courierId }
    });
  }

  async addTrackingEvent(orderId: string, status: string): Promise<any> {
    return prisma.orderTrackingEvent.create({
      data: { orderId, status }
    });
  }

  async getOrderTimeline(orderId: string): Promise<any[]> {
    return prisma.orderTrackingEvent.findMany({
      where: { orderId },
      orderBy: { timestamp: "asc" }
    });
  }

  async getCustomerTracking(orderId: string): Promise<TrackingInfo> {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) throw new Error("Order not found");

    const timeline = await this.getOrderTimeline(orderId);

    return {
      orderStatus: order.status,
      courierLocation: null,
      timeline
    };
  }

  async getActiveCouriers(branchId: string) {
    return prisma.courierLocation.findMany({
      where: {
        courier: { branchId }
      },
      include: {
        courier: true
      }
    });
  }
}

export const courierTrackingService = new CourierTrackingService();
