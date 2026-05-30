import { randomUUID } from "crypto";
import { prisma } from "../prisma/client.js";
import { OrderLifecycleService } from "./order/orderLifecycle.service.js";

interface LocationData {
  orderId?: string;
  lat: number;
  lng: number;
  accuracy?: number;
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
    return prisma.courierLocation.create({
      data: {
        id: randomUUID(),
        latitude: data.lat,
        longitude: data.lng,
        accuracy: data.accuracy ?? null,
        courier: { connect: { id: courierId } },
        order: data.orderId ? { connect: { id: data.orderId } } : undefined
      }
    });
  }

  async getCourierLocation(courierId: string): Promise<any> {
    return prisma.courierLocation.findFirst({
      where: { courierId },
      orderBy: { createdAt: "desc" }
    });
  }

  async addTrackingEvent(orderId: string, status: string): Promise<any> {
    // Delegate to lifecycle service so transitions and tracking are centralized
    return OrderLifecycleService.updateStatus(orderId, status);
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




