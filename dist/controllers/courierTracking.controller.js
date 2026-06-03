import { courierTrackingService } from "../services/courierTracking.service.js";
import { wrap } from "../contracts/api.js";
export const CourierTrackingController = {
    // Courier updates GPS
    updateLocation: wrap(async (req) => {
        const courierId = req.user.id;
        const data = req.body;
        const result = await courierTrackingService.updateLocation(courierId, data);
        return result;
    }),
    // Customer tracking screen
    customerTracking: wrap(async (req) => {
        const { orderId } = req.params;
        const result = await courierTrackingService.getCustomerTracking(orderId);
        return result;
    }),
    // Add tracking event (courier or system)
    addEvent: wrap(async (req) => {
        const { orderId, status } = req.body;
        const event = await courierTrackingService.addTrackingEvent(orderId, status);
        return event;
    }),
    // Manager live map
    managerLiveMap: wrap(async (req) => {
        const branchId = req.user.branchId;
        const couriers = await courierTrackingService.getActiveCouriers(branchId);
        return couriers;
    })
};
