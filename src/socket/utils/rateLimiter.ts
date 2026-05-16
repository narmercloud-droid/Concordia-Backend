import { Socket } from "socket.io";

interface RateLimitConfig {
  rate: number;           // events per second
  burst: number;          // max burst size
  window: number;         // time window in ms
}

interface RateLimitState {
  count: number;
  tokens: number;
  lastReset: number;
  burstUsed: number;
}

interface SocketRateLimitState extends RateLimitState {
  ipData?: IPRateLimitState;
  branchData?: BranchRateLimitState;
}

interface IPRateLimitState {
  count: number;
  tokens: number;
  lastReset: number;
}

interface BranchRateLimitState {
  count: number;
  tokens: number;
  lastReset: number;
}

// ===== GLOBAL STATE =====
const socketLimits = new Map<string, SocketRateLimitState>();
const ipLimits = new Map<string, IPRateLimitState>();
const branchLimits = new Map<string, BranchRateLimitState>();

const DEFAULT_CONFIG: RateLimitConfig = {
  rate: 20,               // 20 events/sec default
  burst: 40,              // burst up to 40
  window: 1000            // 1 second window
};

/**
 * Initialize rate limit state for a socket
 */
export const initSocketRateLimit = (
  socket: Socket,
  config: RateLimitConfig = DEFAULT_CONFIG
): SocketRateLimitState => {
  const clientIP = socket.handshake.address;
  
  const state: SocketRateLimitState = {
    count: 0,
    tokens: config.rate,
    lastReset: Date.now(),
    burstUsed: 0
  };

  // IP-based state
  if (!ipLimits.has(clientIP)) {
    ipLimits.set(clientIP, {
      count: 0,
      tokens: config.rate * 2,
      lastReset: Date.now()
    });
  }
  state.ipData = ipLimits.get(clientIP);

  // Branch-based state (if branch available)
  if (socket.data?.branchId) {
    const branchId = socket.data.branchId;
    if (!branchLimits.has(branchId)) {
      branchLimits.set(branchId, {
        count: 0,
        tokens: config.rate * 10,
        lastReset: Date.now()
      });
    }
    state.branchData = branchLimits.get(branchId);
  }

  socketLimits.set(socket.id, state);
  return state;
};

/**
 * Check if an event is allowed by rate limiting
 * Returns { allowed: boolean; reason?: string }
 */
export const checkRateLimit = (
  socket: Socket,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; reason?: string } => {
  const now = Date.now();
  
  // Get or init socket state
  let state = socketLimits.get(socket.id);
  if (!state) {
    state = initSocketRateLimit(socket, config);
  }

  // ===== SOCKET-LEVEL RATE LIMITING =====
  const timeSinceReset = now - state.lastReset;
  
  if (timeSinceReset >= config.window) {
    // Reset tokens
    state.tokens = config.rate;
    state.count = 0;
    state.burstUsed = 0;
    state.lastReset = now;
  }

  if (state.tokens > 0) {
    state.tokens--;
    state.count++;
    return { allowed: true };
  }

  // Use burst allowance
  if (state.burstUsed < config.burst) {
    state.burstUsed++;
    state.count++;
    return { allowed: true };
  }

  // Check IP-level rate limiting
  if (state.ipData) {
    const ipTimeSinceReset = now - state.ipData.lastReset;
    
    if (ipTimeSinceReset >= config.window) {
      state.ipData.tokens = config.rate * 2;
      state.ipData.count = 0;
      state.ipData.lastReset = now;
    }

    if (state.ipData.tokens > 0) {
      state.ipData.tokens--;
      state.ipData.count++;
      return { allowed: true };
    }
  }

  // Check branch-level rate limiting
  if (state.branchData && socket.data?.branchId) {
    const branchTimeSinceReset = now - state.branchData.lastReset;
    
    if (branchTimeSinceReset >= config.window) {
      state.branchData.tokens = config.rate * 10;
      state.branchData.count = 0;
      state.branchData.lastReset = now;
    }

    if (state.branchData.tokens > 0) {
      state.branchData.tokens--;
      state.branchData.count++;
      return { allowed: true };
    }
  }

  return { allowed: false, reason: "Rate limit exceeded" };
};

/**
 * Clean up rate limit state when socket disconnects
 */
export const cleanupSocketRateLimit = (socket: Socket): void => {
  socketLimits.delete(socket.id);
};

/**
 * Get rate limit stats for a socket
 */
export const getRateLimitStats = (socket: Socket) => {
  const state = socketLimits.get(socket.id);
  if (!state) return null;

  return {
    socketId: socket.id,
    eventCount: state.count,
    tokens: state.tokens,
    burstUsed: state.burstUsed,
    ipCount: state.ipData?.count || 0,
    branchCount: state.branchData?.count || 0
  };
};

/**
 * Middleware for Socket.IO namespace
 */
export const createRateLimitMiddleware = (config: RateLimitConfig = DEFAULT_CONFIG) => {
  return (socket: Socket, next: (err?: Error) => void) => {
    // Initialize rate limit for this socket
    initSocketRateLimit(socket, config);
    next();
  };
};

/**
 * Event listener wrapper that enforces rate limiting
 */
export const withRateLimit = (
  socket: Socket,
  event: string,
  handler: (data: any) => void,
  config: RateLimitConfig = DEFAULT_CONFIG
) => {
  socket.on(event, (data) => {
    const { allowed, reason } = checkRateLimit(socket, config);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for event "${event}" on socket ${socket.id}: ${reason}`);
      return;
    }

    handler(data);
  });
};

/**
 * Cleanup all rate limit data for an IP when needed
 */
export const cleanupIPRateLimit = (clientIP: string): void => {
  ipLimits.delete(clientIP);
};

/**
 * Cleanup all rate limit data for a branch
 */
export const cleanupBranchRateLimit = (branchId: string): void => {
  branchLimits.delete(branchId);
};

/**
 * Get all rate limit stats
 */
export const getAllRateLimitStats = () => {
  return {
    activeSocketLimits: socketLimits.size,
    activeIPLimits: ipLimits.size,
    activeBranchLimits: branchLimits.size
  };
};
