export const DRIVER_EVENTS = {
  CONNECT: "driver:connect",
  DISCONNECT: "driver:disconnect",
  LOCATION_UPDATE: "driver:location:update",
  AVAILABILITY_UPDATE: "driver:availability:update",
  JOIN_ORDER: "driver:order:join",
  LEAVE_ORDER: "driver:order:leave"
} as const;

export const ORDER_EVENTS = {
  CREATED: "order:created",
  ASSIGNED: "order:assigned",
  STATUS_UPDATE: "order:status:update",
  CANCELLED: "order:cancelled",
  DELIVERED: "order:delivered"
} as const;
