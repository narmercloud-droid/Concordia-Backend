"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket.js";

const TRACKING_EVENTS = [
  "order_accepted",
  "order_preparing",
  "order_ready",
  "order_completed",
  "order_rejected",
  "customer-update"
] as const;

export function useTrackingSocket(token: string, onUpdate: () => void) {
  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = getSocket();
    socket.emit("join_customer_tracking", token);

    const handleUpdate = () => onUpdate();
    TRACKING_EVENTS.forEach(event => socket.on(event, handleUpdate));

    return () => {
      TRACKING_EVENTS.forEach(event => socket.off(event, handleUpdate));
    };
  }, [token, onUpdate]);
}
