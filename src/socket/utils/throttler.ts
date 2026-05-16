import { Socket } from "socket.io";

interface ThrottleState {
  lastEmitTime: number;
  pendingData?: any;
  timeout?: NodeJS.Timeout;
}

// ===== GLOBAL STATE =====
const throttleStates = new Map<string, Map<string, ThrottleState>>();

interface ThrottleConfig {
  interval: number;  // ms between events
  trailing?: boolean; // emit last pending event after throttle expires
}

/**
 * Initialize throttle state for a socket and event
 */
const initThrottleState = (socketId: string, event: string): ThrottleState => {
  if (!throttleStates.has(socketId)) {
    throttleStates.set(socketId, new Map());
  }

  const socketEvents = throttleStates.get(socketId)!;
  
  if (!socketEvents.has(event)) {
    socketEvents.set(event, { lastEmitTime: 0 });
  }

  return socketEvents.get(event)!;
};

/**
 * Throttle an emit operation
 * Returns { allowed: boolean; emit?: () => void }
 */
export const throttleEmit = (
  socket: Socket,
  event: string,
  data: any,
  config: ThrottleConfig
): { allowed: boolean; queued?: boolean } => {
  const now = Date.now();
  const state = initThrottleState(socket.id, event);
  const timeSinceLastEmit = now - state.lastEmitTime;

  if (timeSinceLastEmit >= config.interval) {
    // Allow emit immediately
    state.lastEmitTime = now;
    state.pendingData = undefined;

    // Clear any pending timeout
    if (state.timeout) {
      clearTimeout(state.timeout);
      state.timeout = undefined;
    }

    return { allowed: true };
  }

  // Store pending data
  state.pendingData = data;

  // Schedule trailing emit if enabled
  if (config.trailing && !state.timeout) {
    const remainingTime = config.interval - timeSinceLastEmit;
    
    state.timeout = setTimeout(() => {
      if (state.pendingData) {
        state.lastEmitTime = Date.now();
        state.pendingData = undefined;
        state.timeout = undefined;
      }
    }, remainingTime);
  }

  return { allowed: false, queued: true };
};

/**
 * Get pending data for a throttled event (for manual trailing)
 */
export const getPendingData = (socket: Socket, event: string): any => {
  const state = initThrottleState(socket.id, event);
  return state.pendingData;
};

/**
 * Force emit pending data and reset throttle
 */
export const flushPending = (socket: Socket, event: string): any => {
  const state = initThrottleState(socket.id, event);
  
  if (state.timeout) {
    clearTimeout(state.timeout);
    state.timeout = undefined;
  }

  const pending = state.pendingData;
  state.pendingData = undefined;
  state.lastEmitTime = Date.now();

  return pending;
};

/**
 * Clean up throttle state when socket disconnects
 */
export const cleanupSocketThrottle = (socket: Socket): void => {
  if (!throttleStates.has(socket.id)) return;

  const socketEvents = throttleStates.get(socket.id)!;
  
  // Clear all pending timeouts
  for (const state of socketEvents.values()) {
    if (state.timeout) {
      clearTimeout(state.timeout);
    }
  }

  throttleStates.delete(socket.id);
};

/**
 * Get throttle stats for a socket
 */
export const getThrottleStats = (socket: Socket) => {
  if (!throttleStates.has(socket.id)) return null;

  const socketEvents = throttleStates.get(socket.id)!;
  const stats: any = {};

  for (const [event, state] of socketEvents) {
    stats[event] = {
      lastEmitTime: state.lastEmitTime,
      hasPending: !!state.pendingData,
      hasPendingTimeout: !!state.timeout
    };
  }

  return stats;
};

/**
 * Decorator-like function for throttled socket event handlers
 */
export const withThrottle = (
  socket: Socket,
  event: string,
  handler: (data: any) => void,
  config: ThrottleConfig
) => {
  const effectiveConfig: ThrottleConfig = {
    interval: config.interval,
    trailing: config.trailing !== false  // Default to trailing enabled
  };

  socket.on(event, (data) => {
    const { allowed } = throttleEmit(socket, event, data, effectiveConfig);

    if (allowed) {
      handler(data);
    }
  });
};

/**
 * Create a throttled emit wrapper
 */
export const createThrottledEmitter = (
  socket: Socket,
  config: ThrottleConfig
) => {
  return (event: string, data: any) => {
    const { allowed } = throttleEmit(socket, event, data, config);
    return allowed;
  };
};

/**
 * Reset throttle state for a specific event
 */
export const resetEventThrottle = (socket: Socket, event: string): void => {
  if (!throttleStates.has(socket.id)) return;

  const socketEvents = throttleStates.get(socket.id)!;
  
  if (socketEvents.has(event)) {
    const state = socketEvents.get(event)!;
    if (state.timeout) {
      clearTimeout(state.timeout);
    }
    socketEvents.delete(event);
  }
};

/**
 * Get all throttle stats across all sockets
 */
export const getAllThrottleStats = () => {
  return {
    activeSockets: throttleStates.size,
    totalThrottledEvents: Array.from(throttleStates.values()).reduce(
      (sum, events) => sum + events.size,
      0
    )
  };
};
